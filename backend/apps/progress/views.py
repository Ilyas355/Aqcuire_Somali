from django.contrib.auth.models import User
from django.db.models import F
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.content.models import UserStoryProgress
from apps.curriculum.models import QuizQuestion, Section, Subtopic
from apps.users.models import UserLevel, UserProfile

from .models import QuizAttempt, UserSectionProgress, UserSubtopicProgress, VocabReview
from .serializers import (
    QuizSubmitSerializer,
    SubtopicProgressUpdateSerializer,
    VocabDueSerializer,
    VocabReviewSerializer,
    WeakQuestionSerializer,
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
            level_subtitle = current_level.subtitle
            level_xp_required = current_level.xp_required
            user_level_percentage = user_level.level_percentage
            next_level_name = user_level.next_level_name
        except UserLevel.DoesNotExist:
            greeting_level = None
            level_description = None
            level_subtitle = None
            user_level_percentage = 0
            next_level_name = None
            level_xp_required = 0
            user_level = None

        current_story = UserStoryProgress.get_current_for_user(user)

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
            'level_subtitle': level_subtitle,
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
            'xp_into_level': user_level.xp_into_level if user_level else 0,
            'level_xp_required': level_xp_required,
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

        is_completed = data['is_completed']
        phrases_completed = min(data['phrases_completed'], subtopic.phrases.count())

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
            UserSectionProgress.record_subtopic_completed(request.user, subtopic)

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
        already_correct = QuizAttempt.was_answered_correctly(request.user, question)
        xp_awarded = question.xp_for_correct() if is_correct and not already_correct else 0

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


class WeakQuestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        weak = QuizAttempt.weak_questions_for(request.user)
        serializer = WeakQuestionSerializer(weak, many=True)
        return Response(serializer.data)
