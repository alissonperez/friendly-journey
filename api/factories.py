import factory
import factory.fuzzy
from api import models


class AutoMakerFactory(factory.django.DjangoModelFactory):
    name = factory.Faker('company')

    class Meta:
        model = models.AutoMaker


class VehicleModelFactory(factory.django.DjangoModelFactory):
    auto_maker = factory.SubFactory(AutoMakerFactory)
    name = factory.Faker('company')
    year = factory.fuzzy.FuzzyInteger(1970, 2016)
    model_type = factory.fuzzy.FuzzyChoice([i[0] for i in models.VehicleModel.TYPES])

    class Meta:
        model = models.VehicleModel
