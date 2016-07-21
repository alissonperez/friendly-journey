import factory
from api import models


class AutoMakerFactory(factory.django.DjangoModelFactory):
    name = factory.Faker('company')

    class Meta:
        model = models.AutoMaker
