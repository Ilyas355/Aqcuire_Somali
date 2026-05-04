from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from apps.progress.models import UserSectionProgress

from .models import Section, Subtopic
from .serializers import SectionSerializer, SubtopicDetailSerializer


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
