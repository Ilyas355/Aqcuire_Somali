from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/curriculum/', include('apps.curriculum.urls')),
    path('api/progress/', include('apps.progress.urls')),
    path('api/content/', include('apps.content.urls')),
    path('api/community/', include('apps.community.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
