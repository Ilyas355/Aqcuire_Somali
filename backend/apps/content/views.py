from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Story, StoryQuizQuestion, UserStoryProgress
from .serializers import StoryDetailSerializer, StoryListSerializer, StoryQuizQuestionSerializer


class StoryListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StoryListSerializer

    def get_queryset(self):
        queryset = Story.objects.select_related('category').order_by('order')
        category_id = self.request.query_params.get('category')
        if category_id:
            try:
                queryset = queryset.filter(category_id=int(category_id))
            except (ValueError, TypeError):
                pass
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        progress_map = {
            p.story_id: p
            for p in UserStoryProgress.objects.filter(user=self.request.user)
        }
        context['progress_map'] = progress_map

        story_difficulty_map = {
            s.id: s.difficulty.lower()
            for s in Story.objects.only('id', 'difficulty')
        }
        context['completed_difficulties'] = {
            story_difficulty_map[sid]
            for sid, p in progress_map.items()
            if p.is_completed and sid in story_difficulty_map
        }
        return context


class StoryDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StoryDetailSerializer
    queryset = Story.objects.select_related('category').prefetch_related('lines__tips')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        try:
            progress = UserStoryProgress.objects.get(
                user=self.request.user, story_id=self.kwargs['pk']
            )
            context['progress_map'] = {progress.story_id: progress}
        except UserStoryProgress.DoesNotExist:
            context['progress_map'] = {}
        return context


class StoryProgressUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        story = get_object_or_404(Story, pk=pk)
        try:
            last_line_position = int(request.data.get('last_line_position', ''))
        except (ValueError, TypeError):
            return Response({'error': 'last_line_position must be an integer'}, status=400)

        progress, _ = UserStoryProgress.objects.get_or_create(user=request.user, story=story)
        if not progress.is_completed:
            progress.last_line_position = last_line_position
            progress.save(update_fields=['last_line_position'])
        return Response({'last_line_position': progress.last_line_position})


class StoryCompleteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        story = get_object_or_404(Story.objects.prefetch_related('lines'), pk=pk)
        progress, _ = UserStoryProgress.objects.get_or_create(user=request.user, story=story)
        xp_awarded = progress.complete(story)
        return Response({'is_completed': True, 'xp_awarded': xp_awarded})


class StoryQuizView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StoryQuizQuestionSerializer

    def get_queryset(self):
        story = get_object_or_404(Story, pk=self.kwargs['pk'])
        return StoryQuizQuestion.objects.filter(story=story)
