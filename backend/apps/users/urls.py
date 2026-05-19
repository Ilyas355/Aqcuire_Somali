from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import ForgotPasswordView, PasswordChangeView, ProfileView, RegisterView, ResetPasswordView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', TokenObtainPairView.as_view(), name='auth-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='auth-token-refresh'),
    path('profile/', ProfileView.as_view(), name='auth-profile'),
    path('password/change/', PasswordChangeView.as_view(), name='auth-password-change'),
    path('password/forgot/', ForgotPasswordView.as_view(), name='auth-password-forgot'),
    path('password/reset/', ResetPasswordView.as_view(), name='auth-password-reset'),
]
