from rest_framework import serializers
from api import models


class AutoMakerSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.AutoMaker
        fiels = ('id', 'name')
