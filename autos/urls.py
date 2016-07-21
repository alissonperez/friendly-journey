from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static


urlpatterns = [
    url(r'^', include('front.urls')),
    url(r'^api/', include('api.urls', namespace='api'))
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
