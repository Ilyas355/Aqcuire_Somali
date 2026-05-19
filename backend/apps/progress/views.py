from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import F
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.content.models import Story, UserStoryProgress
from apps.curriculum.models import QuizQuestion, Section, Subtopic
from apps.users.models import Level, UserLevel, UserProfile

from .models import QuizAttempt, UserSectionProgress, UserSubtopicProgress, VocabReview
from .serializers import (
    QuizSubmitSerializer,
    SubtopicProgressUpdateSerializer,
    VocabDueSerializer,
    VocabReviewSerializer,
)


class HomeScreenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = User.objects.select_related(
            'profile', 'level__current_level'
        ).get(pk=request.user.pk)

        profile = user.profile

        try:
            user_level = user.level
            current_level = user_level.current_level
            greeting_level = current_level.name
            level_description = current_level.description
            level_xp_required = current_level.xp_required
            user_level_percentage = (
                round(user_level.xp_into_level / level_xp_required * 100)
                if level_xp_required > 0 else 0
            )
            next_level = Level.objects.filter(order__gt=current_level.order).order_by('order').first()
            if next_level is None:
                next_level_name = None
                user_level_percentage = 100
            else:
                next_level_name = next_level.name
        except UserLevel.DoesNotExist:
            greeting_level = None
            level_description = None
            user_level_percentage = 0
            next_level_name = None

        in_progress = (
            UserStoryProgress.objects
            .filter(user=user, is_completed=False, last_line_position__gt=0)
            .select_related('story__category')
            .order_by('-story__order')
            .first()
        )
        current_story = None
        if in_progress:
            s = in_progress.story
            current_story = {
                'id': s.id,
                'title': s.title,
                'difficulty': s.difficulty,
                'duration_seconds': s.duration_seconds,
                'xp_reward': s.xp_reward,
                'last_line_position': in_progress.last_line_position,
                'is_completed': False,
                'category': s.category.name,
            }
        else:
            first_story = Story.objects.select_related('category').order_by('order').first()
            if first_story:
                current_story = {
                    'id': first_story.id,
                    'title': first_story.title,
                    'difficulty': first_story.difficulty,
                    'duration_seconds': first_story.duration_seconds,
                    'xp_reward': first_story.xp_reward,
                    'last_line_position': 0,
                    'is_completed': False,
                    'category': first_story.category.name,
                }

        total_sections = Section.objects.count()
        total_subtopics = Subtopic.objects.count()
        completed_sections = UserSectionProgress.objects.filter(
            user=user, is_completed=True
        ).count()
        completed_subtopics = UserSubtopicProgress.objects.filter(
            user=user, is_completed=True
        ).count()
        subtopics_remaining = max(0, total_subtopics - completed_subtopics)
        overall_percentage = (
            round(completed_sections / total_sections * 100)
            if total_sections > 0 else 0
        )

        vocab_due_count = VocabReview.objects.filter(
            user=user,
            next_review__lte=timezone.now(),
        ).count()

        return Response({
            'greeting_level': greeting_level,
            'level_description': level_description,
            'current_story': current_story,
            'overall_progress': {
                'percentage': overall_percentage,
                'section': total_sections,
                'completed_sections': completed_sections,
                'subtopics_remaining': subtopics_remaining,
            },
            'vocab_due_count': vocab_due_count,
            'user_xp': profile.total_xp,
            'user_streak': profile.current_streak,
            'user_level_percentage': user_level_percentage,
            'next_level_name': next_level_name,
        })


class SubtopicProgressUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        subtopic = get_object_or_404(
            Subtopic.objects.select_related('section'), pk=pk
        )
        serializer = SubtopicProgressUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        phrase_count = subtopic.phrases.count()
        phrases_completed = min(data['phrases_completed'], phrase_count)
        is_completed = data['is_completed']

        with transaction.atomic():
            progress, _ = UserSubtopicProgress.objects.get_or_create(
                user=request.user,
                subtopic=subtopic,
            )
            was_completed = progress.is_completed
            progress.current_step = data['current_step']
            progress.phrases_completed = phrases_completed
            progress.is_completed = is_completed
            progress.save(update_fields=['current_step', 'phrases_completed', 'is_completed', 'last_accessed'])

            if is_completed and not was_completed:
                VocabReview.queue_phrases(request.user, subtopic)
                section_progress, _ = UserSectionProgress.objects.get_or_create(
                    user=request.user,
                    section=subtopic.section,
                    defaults={'is_unlocked': True},
                )
                UserSectionProgress.objects.filter(pk=section_progress.pk).update(
                    subtopics_completed=F('subtopics_completed') + 1
                )
                section_progress.refresh_from_db()
                total_section_subtopics = Subtopic.objects.filter(section=subtopic.section).count()
                if section_progress.subtopics_completed >= total_section_subtopics:
                    UserSectionProgress.objects.filter(pk=section_progress.pk).update(is_completed=True)
                    next_section = (
                        Section.objects
                        .filter(order__gt=subtopic.section.order)
                        .order_by('order')
                        .first()
                    )
                    if next_section:
                        UserSectionProgress.objects.get_or_create(
                            user=request.user,
                            section=next_section,
                            defaults={'is_unlocked': True},
                        )

        return Response({
            'current_step': progress.current_step,
            'phrases_completed': progress.phrases_completed,
            'is_completed': progress.is_completed,
        })


class QuizSubmitView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = QuizSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        question = get_object_or_404(QuizQuestion, pk=data['question_id'])
        is_correct = question.check_answer(data['answer_given'])
        xp_awarded = question.xp_for_correct() if is_correct else 0

        QuizAttempt.objects.create(
            user=request.user,
            question=question,
            answer_given=data['answer_given'],
            is_correct=is_correct,
            xp_awarded=xp_awarded,
        )

        if is_correct and xp_awarded > 0:
            UserProfile.objects.filter(user=request.user).update(
                total_xp=F('total_xp') + xp_awarded
            )
            try:
                user_level = UserLevel.objects.select_related('current_level').get(user=request.user)
                user_level.apply_xp(xp_awarded)
            except UserLevel.DoesNotExist:
                pass

        return Response({
            'is_correct': is_correct,
            'xp_awarded': xp_awarded,
            'correct_answer': question.correct_answer,
        })


class VocabDueView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = VocabDueSerializer

    def get_queryset(self):
        return VocabReview.objects.filter(
            user=self.request.user,
            next_review__lte=timezone.now(),
        ).select_related('phrase')


class VocabReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        review = get_object_or_404(VocabReview, pk=pk, user=request.user)
        serializer = VocabReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review.schedule(serializer.validated_data['quality'])
        return Response(VocabDueSerializer(review).data)
