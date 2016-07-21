#from django.conf.urls import url
from rest_framework import routers

from api import views

router = routers.SimpleRouter()
router.register(r'v1/automakers', views.AutoMakerViewSet)
router.register(r'v1/models', views.VehicleModelViewSet)

urlpatterns = router.urls
