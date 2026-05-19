from django.contrib import admin

from .models import Story, StoryCategory, StoryLine, StoryQuizQuestion, StoryTip, UserStoryProgress


@admin.register(StoryCategory)
class StoryCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'order']
    ordering = ['order']


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'difficulty', 'xp_reward', 'is_trending', 'order']
    list_filter = ['category', 'difficulty', 'is_trending']
    ordering = ['order']
    search_fields = ['title']


@admin.register(StoryLine)
class StoryLineAdmin(admin.ModelAdmin):
    list_display = ['story', 'speaker_name', 'somali', 'order']
    list_filter = ['story']
    ordering = ['story__order', 'order']


@admin.register(StoryTip)
class StoryTipAdmin(admin.ModelAdmin):
    list_display = ['story_line', 'tip_text']


@admin.register(StoryQuizQuestion)
class StoryQuizQuestionAdmin(admin.ModelAdmin):
    list_display = ['story', 'question_text', 'order']
    list_filter = ['story']
    ordering = ['story__order', 'order']


@admin.register(UserStoryProgress)
class UserStoryProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'story', 'is_completed', 'last_line_position']
    list_filter = ['is_completed']
    search_fields = ['user__username']
