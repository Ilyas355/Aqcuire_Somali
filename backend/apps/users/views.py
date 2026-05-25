from django.contrib.auth import password_validation
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.mail import send_mail
from django.db import IntegrityError
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PasswordResetToken, UserProfile
from .serializers import ProfileSerializer, RegisterSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = serializer.save()
        except IntegrityError:
            return Response(
                {'handle': ['This handle is already taken.']},
                status=status.HTTP_400_BAD_REQUEST,
            )
        tokens = UserProfile.issue_tokens(user)
        return Response({
            **tokens,
            'user': {'id': user.id, 'username': user.username, 'email': user.email},
        }, status=status.HTTP_201_CREATED)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_object(self):
        return UserProfile.objects.select_related(
            'user__level__current_level'
        ).get(user=self.request.user)


class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not current_password or not new_password:
            return Response(
                {'detail': 'Both current_password and new_password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            request.user.profile.change_password(current_password, new_password)
        except ValueError as e:
            return Response({'detail': e.args[0]}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'detail': 'Password updated successfully.'})


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        if not email:
            return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email__iexact=email)
            token = PasswordResetToken.generate_for(user)
            send_mail(
                subject='Your Aquire Somali reset code',
                message=(
                    f'Your password reset code is: {token.code}\n\n'
                    f'This code expires in {PasswordResetToken.EXPIRY_MINUTES} minutes.\n\n'
                    f'If you did not request this, ignore this email.'
                ),
                from_email=None,
                recipient_list=[user.email],
                fail_silently=True,
            )
        except User.DoesNotExist:
            pass

        return Response({'detail': 'If an account with that email exists, a reset code has been sent.'})


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        code = request.data.get('code', '').strip()
        new_password = request.data.get('new_password', '')

        if not email or not code or not new_password:
            return Response(
                {'detail': 'email, code, and new_password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({'detail': 'Invalid or expired code.'}, status=status.HTTP_400_BAD_REQUEST)

        token = PasswordResetToken.objects.filter(user=user, code=code).first()
        if not token or not token.is_valid():
            return Response({'detail': 'Invalid or expired code.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            password_validation.validate_password(new_password, user)
        except DjangoValidationError as e:
            return Response({'detail': e.messages}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        token.consume()
        return Response({'detail': 'Password reset successfully.'})
