import random

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.progress.models import UserSectionProgress

from .models import Section, Subtopic
from .serializers import SectionSerializer, SubtopicDetailSerializer

GREETING_PHRASE_COUNT = 23
GREETING_SAMPLE_SIZE = 15


class SectionListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SectionSerializer
    queryset = Section.objects.prefetch_related('subtopics')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['progress_map'] = {
            p.section_id: p
            for p in UserSectionProgress.objects.filter(user=self.request.user)
        }
        return context


class SubtopicDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SubtopicDetailSerializer
    queryset = Subtopic.objects.select_related('section').prefetch_related(
        'phrases__grammar_notes',
        'phrases__quiz_questions',
        'key_patterns',
        'common_mistakes',
        'survival_lines',
    )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        all_phrases = list(instance.phrases.order_by('order'))

        is_greeting_subtopic = (
            instance.order == 1
            and instance.section.order == 1
            and len(all_phrases) >= GREETING_PHRASE_COUNT
        )
        sampled_phrases = (
            random.sample(all_phrases[:GREETING_PHRASE_COUNT], GREETING_SAMPLE_SIZE)
            if is_greeting_subtopic else all_phrases
        )

        context = self.get_serializer_context()
        context['sampled_phrases'] = sampled_phrases
        serializer = SubtopicDetailSerializer(instance, context=context)
        return Response(serializer.data)
