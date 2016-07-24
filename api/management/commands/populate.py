from django.core.management.base import BaseCommand

from api import factories, models


class Command(BaseCommand):
    help = 'Populate database with some data'

    def handle(self, *args, **options):
        self._out_success('Criando montadoras')

        volks = factories.AutoMakerFactory(name='Volskwagen')
        fiat = factories.AutoMakerFactory(name='Fiat')
        honda = factories.AutoMakerFactory(name='Honda')
        bmw = factories.AutoMakerFactory(name='BMW')

        self._out_success('Criando modelos')

        cars = []
        cars.append(factories.VehicleModelFactory(auto_maker=volks,
                                                  name='Fusca',
                                                  year=1969,
                                                  model_type=models.VehicleModel.TYPE_CAR))

        cars.append(factories.VehicleModelFactory(auto_maker=volks,
                                                  name='Variant',
                                                  year=1977,
                                                  model_type=models.VehicleModel.TYPE_CAR))

        cars.append(factories.VehicleModelFactory(auto_maker=fiat,
                                                  name='147',
                                                  year=1986,
                                                  model_type=models.VehicleModel.TYPE_CAR))

        cars.append(factories.VehicleModelFactory(auto_maker=fiat,
                                                  name='Puntu',
                                                  year=2016,
                                                  model_type=models.VehicleModel.TYPE_CAR))

        cars.append(factories.VehicleModelFactory(auto_maker=honda,
                                                  name='Civic',
                                                  year=2011,
                                                  model_type=models.VehicleModel.TYPE_CAR))

        cars.append(factories.VehicleModelFactory(auto_maker=bmw,
                                                  name='Z3',
                                                  year=1995,
                                                  model_type=models.VehicleModel.TYPE_CAR))

        motorcycles = []
        motorcycles.append(factories.VehicleModelFactory(auto_maker=honda,
                                                         name='CB750',
                                                         year=1973,
                                                         model_type=models.VehicleModel.TYPE_MOTOCYCLE))

        motorcycles.append(factories.VehicleModelFactory(auto_maker=bmw,
                                                         name='G310R',
                                                         year=2016,
                                                         model_type=models.VehicleModel.TYPE_MOTOCYCLE))

        self._out_success('Criando carros')
        for car in cars:
            for i in range(2):
                factories.CarVehicleFactory(model=car)

        self._out_success('Criando motos')
        for motorcycle in motorcycles:
            for i in range(2):
                factories.MotorCycleVehicleFactory(model=motorcycle)

        self._out_success('Veiculos criados!')

    def _out_success(self, message):
        self.stdout.write(self.style.SUCCESS(message))
