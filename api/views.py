from rest_framework import viewsets

from api import models, serializers


class AutoMakerViewSet(viewsets.ModelViewSet):
    queryset = models.AutoMaker.objects.all()
    serializer_class = serializers.AutoMakerSerializer
