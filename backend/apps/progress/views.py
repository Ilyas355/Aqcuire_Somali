from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import F
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.curriculum.models import QuizQuestion, Section, Subtopic
from apps.users.models import Level, UserLevel, UserProfile

from .models import QuizAttempt, UserSectionProgress, UserSubtopicProgress, VocabReview
from .serializers import (
    QuizSubmitSerializer,
    SubtopicProgressUpdateSerializer,
    VocabDueSerializer,
)

XP_PER_LAYER = {
    QuizQuestion.Layer.RECOGNITION: 5,
    QuizQuestion.Layer.RECALL: 10,
    QuizQuestion.Layer.PRODUCTION: 15,
}


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

        current_subtopic_progress = (
            UserSubtopicProgress.objects
            .filter(user=user, is_completed=False)
            .select_related('subtopic__section')
            .order_by('-last_accessed')
            .first()
        )
        current_subtopic = None
        if current_subtopic_progress:
            current_subtopic = {
                'id': current_subtopic_progress.subtopic.id,
                'title': current_subtopic_progress.subtopic.title,
                'section': current_subtopic_progress.subtopic.section.title,
                'current_step': current_subtopic_progress.current_step,
            }

        total_sections = Section.objects.count()
        completed_sections = UserSectionProgress.objects.filter(
            user=user, is_completed=True
        ).count()
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
            'current_subtopic': current_subtopic,
            'overall_progress': {
                'percentage': overall_percentage,
                'section': total_sections,
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
            progress.save(update_fields=['current_step', 'phrases_completed', 'is_completed'])

            if is_completed and not was_completed:
                section_progress, _ = UserSectionProgress.objects.get_or_create(
                    user=request.user,
                    section=subtopic.section,
                    defaults={'is_unlocked': True},
                )
                UserSectionProgress.objects.filter(pk=section_progress.pk).update(
                    subtopics_completed=F('subtopics_completed') + 1
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
        is_correct = (
            data['answer_given'].strip().lower() ==
            question.correct_answer.strip().lower()
        )
        xp_awarded = XP_PER_LAYER.get(question.layer, 0) if is_correct else 0

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
