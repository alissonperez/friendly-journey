from django.db import models


class AutoMaker(models.Model):
    name = models.CharField(max_length=16)


class VehicleModel(models.Model):
    auto_maker = models.ForeignKey(AutoMaker)
    name = models.CharField(max_length=20)
    year = models.IntegerField()
