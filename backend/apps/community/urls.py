from django.urls import path

from .views import LeaderboardView, PartnerDetailView, PartnersListView, PartnerProfileView, PartnerRequestView, PresenceCountView, PresenceView, SuggestedPartnerDetailView, SuggestedPartnersView

urlpatterns = [
    path('partner-profile/', PartnerProfileView.as_view(), name='community-partner-profile'),
    path('partners/', PartnersListView.as_view(), name='community-partners'),
    path('partners/suggested/', SuggestedPartnersView.as_view(), name='community-partners-suggested'),
    path('partners/suggested/<int:pk>/', SuggestedPartnerDetailView.as_view(), name='community-partner-suggested-detail'),
    path('partners/request/<int:pk>/', PartnerRequestView.as_view(), name='community-partners-request'),
    path('partners/<int:pk>/', PartnerDetailView.as_view(), name='community-partner-detail'),
    path('leaderboard/', LeaderboardView.as_view(), name='community-leaderboard'),
    path('presence/', PresenceView.as_view(), name='community-presence'),
    path('presence/count/', PresenceCountView.as_view(), name='community-presence-count'),
]
