from rest_framework import serializers
from api import models


class AutoMakerSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.AutoMaker
        fiels = ('id', 'name')


class VehicleModelSerializer(serializers.ModelSerializer):
    auto_maker = serializers.PrimaryKeyRelatedField(queryset=models.AutoMaker.objects.all())
    auto_maker_info = AutoMakerSerializer(
        read_only=True, source='auto_maker')

    class Meta:
        model = models.VehicleModel
        fields = ('id', 'model_type', 'auto_maker',
                  'name', 'year', 'auto_maker_info')
