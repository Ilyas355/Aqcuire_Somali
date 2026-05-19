from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.models import UserProfile

from .models import Partner, PartnerProfile, PartnerRequest, UserPresence, WeeklyChallenge
from .serializers import LeaderboardEntrySerializer, MyPartnerSerializer, PartnerProfileUpdateSerializer, SuggestedPartnerDetailSerializer, SuggestedPartnerSerializer, WeeklyChallengeSerializer


class PartnerProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PartnerProfileUpdateSerializer
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_object(self):
        profile, _ = PartnerProfile.objects.get_or_create(user=self.request.user)
        return profile


class SuggestedPartnersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        candidates = Partner.suggested_candidates_for(request.user)
        status_map = PartnerRequest.request_status_map_for(request.user)

        try:
            requester_partner_profile = request.user.partner_profile
        except PartnerProfile.DoesNotExist:
            requester_partner_profile = None

        serializer = SuggestedPartnerSerializer(
            candidates,
            many=True,
            context={
                'request': request,
                'request_status_map': status_map,
                'requester_partner_profile': requester_partner_profile,
            },
        )
        return Response(serializer.data)


class SuggestedPartnerDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        candidate = get_object_or_404(
            User.objects.select_related('profile', 'partner_profile', 'level__current_level', 'presence'),
            pk=pk,
        )
        effective_status = Partner.effective_request_status(request.user, candidate)

        try:
            requester_partner_profile = request.user.partner_profile
        except PartnerProfile.DoesNotExist:
            requester_partner_profile = None

        serializer = SuggestedPartnerDetailSerializer(
            candidate,
            context={
                'request': request,
                'request_status_map': {candidate.id: effective_status},
                'requester_partner_profile': requester_partner_profile,
            },
        )
        return Response(serializer.data)


class PartnersListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MyPartnerSerializer

    def get_queryset(self):
        return (
            Partner.objects
            .filter(user=self.request.user)
            .select_related('partner__profile', 'partner__partner_profile')
            .order_by('-connected_at')
        )


class PartnerRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        receiver = get_object_or_404(User, pk=pk)

        if receiver == request.user:
            return Response({'error': 'Cannot send a request to yourself.'}, status=400)

        if Partner.objects.filter(user=request.user, partner=receiver).exists():
            return Response({'status': 'already_partners'}, status=400)

        existing = PartnerRequest.objects.filter(
            sender=request.user, receiver=receiver
        ).first()

        if existing:
            if existing.status == PartnerRequest.Status.REJECTED:
                return Response({'status': 'rejected'}, status=400)
            return Response({'status': existing.status})

        status = PartnerRequest.send_or_accept(request.user, receiver)
        return Response({'status': status})

    def delete(self, request, pk):
        sender = get_object_or_404(User, pk=pk)
        partner_request = PartnerRequest.objects.filter(
            sender=sender,
            receiver=request.user,
            status=PartnerRequest.Status.PENDING,
        ).first()
        if not partner_request:
            return Response({'detail': 'No pending request from this user.'}, status=404)
        partner_request.reject(request.user)
        return Response(status=204)


class PartnerDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        partner_user = get_object_or_404(User, pk=pk)
        if not Partner.objects.filter(user=request.user, partner=partner_user).exists():
            return Response({'detail': 'Partner not found.'}, status=404)
        Partner.remove(request.user, partner_user)
        return Response(status=204)


class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tab = request.query_params.get('tab', 'all_time')

        if tab == 'this_week':
            profiles = UserProfile.leaderboard_this_week()
        elif tab == 'partners':
            profiles = UserProfile.leaderboard_partners(request.user)
        else:
            profiles = UserProfile.leaderboard_all_time()

        if tab == 'this_week':
            my_rank = UserProfile.my_rank_this_week(request.user)
        elif tab == 'partners':
            my_rank = None
        else:
            my_rank = UserProfile.my_rank_all_time(request.user)

        current_challenge = WeeklyChallenge.get_current()
        return Response({
            'tab': tab,
            'leaderboard': LeaderboardEntrySerializer(profiles, many=True).data,
            'current_challenge': WeeklyChallengeSerializer(current_challenge).data if current_challenge else None,
            'my_rank': my_rank,
        })


class PresenceView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        UserPresence.mark_online(request.user)
        return Response(status=204)


class PresenceCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'online_count': UserPresence.online_count()})
