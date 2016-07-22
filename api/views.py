from rest_framework import viewsets

from api import models, serializers


class AutoMakerViewSet(viewsets.ModelViewSet):
    queryset = models.AutoMaker.objects.all()
    serializer_class = serializers.AutoMakerSerializer


class VehicleModelViewSet(viewsets.ModelViewSet):
    queryset = models.VehicleModel.objects.all()
    serializer_class = serializers.VehicleModelSerializer


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = models.Vehicle.objects.all()
    serializer_class = serializers.VehicleSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        if 'type' in self.request.query_params:
            queryset = queryset.filter(
                model__model_type=self.request.query_params['type'])

        return queryset
