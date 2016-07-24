import factory
import factory.fuzzy
from api import models

modelFactory = factory.django.DjangoModelFactory


class AutoMakerFactory(modelFactory):
    name = factory.Faker('company')

    class Meta:
        model = models.AutoMaker


class VehicleModelFactory(modelFactory):
    auto_maker = factory.SubFactory(AutoMakerFactory)
    name = factory.Faker('company')
    year = factory.fuzzy.FuzzyInteger(1970, 2016)
    model_type = factory.fuzzy.FuzzyChoice([i[0] for i in models.VehicleModel.TYPES])

    class Meta:
        model = models.VehicleModel


class VehicleFactory(modelFactory):
    model = factory.SubFactory(VehicleModelFactory)
    color = factory.fuzzy.FuzzyChoice([i[0] for i in models.Vehicle.COLORS])
    mileage = factory.fuzzy.FuzzyInteger(1000, 200000)
    engine = factory.fuzzy.FuzzyInteger(100, 2000)

    class Meta:
        model = models.Vehicle


class CarVehicleFactory(VehicleFactory):
    engine = factory.fuzzy.FuzzyInteger(1000, 2200)


class MotorCycleVehicleFactory(VehicleFactory):
    engine = factory.fuzzy.FuzzyInteger(100, 950)
