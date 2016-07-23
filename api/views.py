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
        queryset = self._add_filters(queryset)
        return queryset

    def _add_filters(self, queryset):
        if 'type' in self.request.query_params:
            queryset = queryset.filter(
                model__model_type=self.request.query_params['type'])

        if 'auto_maker' in self.request.query_params:
            queryset = queryset.filter(
                model__auto_maker_id=self.request.query_params['auto_maker'])

        if 'model' in self.request.query_params:
            queryset = queryset.filter(
                model_id=self.request.query_params['model'])

        if 'color' in self.request.query_params:
            queryset = queryset.filter(
                color=self.request.query_params['color'])

        if 'year_start' in self.request.query_params:
            queryset = queryset.filter(
                model__year__gte=self.request.query_params['year_start'])

        if 'year_end' in self.request.query_params:
            queryset = queryset.filter(
                model__year__lte=self.request.query_params['year_end'])

        if 'engine_start' in self.request.query_params:
            queryset = queryset.filter(
                engine__gte=self.request.query_params['engine_start'])

        if 'engine_end' in self.request.query_params:
            queryset = queryset.filter(
                engine__lte=self.request.query_params['engine_end'])

        if 'mileage_start' in self.request.query_params:
            queryset = queryset.filter(
                mileage__gte=self.request.query_params['mileage_start'])

        if 'mileage_end' in self.request.query_params:
            queryset = queryset.filter(
                mileage__lte=self.request.query_params['mileage_end'])

        return queryset
