from django.db import models


class AutoMaker(models.Model):
    name = models.CharField(max_length=16)


class VehicleModel(models.Model):
    TYPE_CAR = 'car'
    TYPE_MOTOCYCLE = 'motorcycle'

    TYPES = (
        (TYPE_CAR, 'Carro'),
        (TYPE_MOTOCYCLE, 'Moto'),
    )

    model_type = models.CharField(max_length=20,
                                  choices=TYPES,
                                  default=TYPE_CAR)
    auto_maker = models.ForeignKey(AutoMaker)
    name = models.CharField(max_length=20)
    year = models.IntegerField()


class Vehicle(models.Model):
    COLORS = (
        ('red', 'Vermelho'),
        ('blue', 'Azul'),
        ('green', 'Verde'),
        ('white', 'Branco'),
        ('grey', 'Cinza'),
        ('black', 'Preto'),
    )

    model = models.ForeignKey(VehicleModel)
    color = models.CharField(max_length=20, choices=COLORS)
    mileage = models.IntegerField()
    engine = models.IntegerField()
