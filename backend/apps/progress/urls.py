from django.urls import path

from .views import HomeScreenView, QuizSubmitView, SubtopicProgressUpdateView, VocabDueView, VocabReviewView, WeakQuestionsView

urlpatterns = [
    path('home/', HomeScreenView.as_view(), name='progress-home'),
    path('subtopic/<int:pk>/update/', SubtopicProgressUpdateView.as_view(), name='progress-subtopic-update'),
    path('quiz/submit/', QuizSubmitView.as_view(), name='progress-quiz-submit'),
    path('quiz/weak/', WeakQuestionsView.as_view(), name='progress-quiz-weak'),
    path('vocab/due/', VocabDueView.as_view(), name='progress-vocab-due'),
    path('vocab/<int:pk>/review/', VocabReviewView.as_view(), name='progress-vocab-review'),
]
