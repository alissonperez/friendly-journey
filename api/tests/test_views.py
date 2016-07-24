import json

from django.test import TestCase, Client
from django.core.urlresolvers import reverse

from api import factories, models


class AutoMakerEndpointTestCase(TestCase):

    def setUp(self):
        self.auto_makers = []
        for i in range(3):
            self.auto_makers.append(factories.AutoMakerFactory())

        self.c = Client()
        self.list_url = reverse('api:automaker-list')

    def test_call_get_on_list_return_all_items(self):
        response = self.c.get(self.list_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 3)

    def test_call_post_must_create_an_item(self):
        data = {'name': 'Gurgel Awesome'}
        response = self.c.post(self.list_url, data=data)

        self.assertEqual(response.status_code, 201)

        models.AutoMaker.objects.get(name=data['name'])

    def test_call_patch_must_update_an_item(self):
        automaker = self.auto_makers[0]

        data = {'name': 'Gurgel Awesome'}

        item_url = reverse('api:automaker-detail', args=[automaker.id])

        response = self.c.patch(item_url, data=json.dumps(data),
                                content_type='application/json')

        self.assertEqual(response.status_code, 200, response.json())
        automaker.refresh_from_db()

        self.assertEqual(automaker.name, 'Gurgel Awesome')

    def test_call_delete_must_delete_an_item(self):
        automaker = self.auto_makers[0]

        item_url = reverse('api:automaker-detail', args=[automaker.id])
        response = self.c.delete(item_url)

        self.assertEquals(response.status_code, 204)

        self.assertIsNone(
            models.AutoMaker.objects.filter(id=automaker.id).first())


class VehicleModelEndpointTestCase(TestCase):

    def setUp(self):
        self.vehicle_models = []
        for i in range(3):
            self.vehicle_models.append(factories.VehicleModelFactory())

        self.c = Client()
        self.list_url = reverse('api:vehiclemodel-list')

    def test_get_must_return_list_of_all_models(self):
        response = self.c.get(self.list_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

    def test_get_with_automaker_return_correct_list(self):
        model = self.vehicle_models[0]
        url = '{}?auto_maker={}'.format(
            self.list_url, model.auto_maker_id)

        response = self.c.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], model.id)

    def test_get_with_type_return_correct_list(self):
        model = self.vehicle_models[0]
        url = '{}?type={}'.format(
            self.list_url, model.model_type)

        response = self.c.get(url)

        expected = set(models.VehicleModel.objects.filter(
            model_type=model.model_type).values_list('id', flat=True))

        result = {i['id'] for i in response.data}

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), len(expected))
        self.assertEqual(result, expected)

    def test_post_must_create_a_vehicle_model(self):
        auto_maker = self.vehicle_models[0].auto_maker
        data = dict(
            name='Corsa',
            year=1997,
            auto_maker=auto_maker.id
        )

        response = self.c.post(self.list_url, data=data)

        self.assertEqual(response.status_code, 201)

        models.VehicleModel.objects.get(name='Corsa',
                                        year=1997,
                                        auto_maker=auto_maker)

    def test_patch_must_edit_a_vehicle_model(self):
        model = self.vehicle_models[0]

        data = dict(name='Celta')

        url = reverse('api:vehiclemodel-detail', args=[model.id])
        response = self.c.patch(url, data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 200)

        model.refresh_from_db()
        self.assertEqual(model.name, 'Celta')

    def test_delete_must_remove_a_vehicle(self):
        model = self.vehicle_models[0]
        url = reverse('api:vehiclemodel-detail', args=[model.id])
        response = self.c.delete(url)

        self.assertEqual(response.status_code, 204)

        self.assertIsNone(models.VehicleModel.objects.filter(id=model.id).first())


class VehicleEndpointTestCase(TestCase):

    def setUp(self):
        self.cars = []
        for i in range(2):
            self.cars.append(
                factories.VehicleFactory(model__model_type=models.VehicleModel.TYPE_CAR))

        self.motocycles = []
        for i in range(2):
            self.motocycles.append(
                factories.VehicleFactory(model__model_type=models.VehicleModel.TYPE_MOTOCYCLE))

        self.c = Client()
        self.list_url = reverse('api:vehicle-list')

    def test_get_must_return_list_of_all_vehicles(self):
        response = self.c.get(self.list_url)
        self.assertEqual(response.status_code, 200)

    def test_get_with_type_car_return_correct_list(self):
        url = '{}?type=car'.format(self.list_url)
        response = self.c.get(url)
        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data), len(self.cars))

        ids = {i['id'] for i in response.data}
        expected_ids = {i.id for i in self.cars}
        self.assertEqual(ids, expected_ids)

    def test_get_with_type_motocycle_return_correct_list(self):
        url = '{}?type=motorcycle'.format(self.list_url)
        response = self.c.get(url)
        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data), len(self.motocycles))

        ids = {i['id'] for i in response.data}
        expected_ids = {i.id for i in self.motocycles}
        self.assertEqual(ids, expected_ids)

    def test_get_with_automaker_return_correct_list(self):
        car = self.cars[0]
        url = '{}?auto_maker={}'.format(self.list_url, car.model.auto_maker_id)
        response = self.c.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], car.id)

    def test_get_with_model_return_correct_list(self):
        car = self.cars[0]
        url = '{}?model={}'.format(self.list_url, car.model_id)
        response = self.c.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], car.id)

    def test_get_with_color_return_correct_list(self):
        car = self.cars[0]
        url = '{}?color={}'.format(self.list_url, car.color)
        response = self.c.get(url)

        self.assertEqual(response.status_code, 200)

        expected = {i.id for i in models.Vehicle.objects.filter(
            color=car.color)}

        result_ids = {i['id'] for i in response.data}

        self.assertEqual(result_ids, expected)

    def test_get_with_year_range_return_correct_list(self):
        car = self.cars[0]
        start, end = car.model.year - 1, car.model.year + 1

        expected = {i.id for i in  models.Vehicle.objects.filter(
            model__year__gte=start,
            model__year__lte=end)}

        url = '{}?year_start={}&year_end={}'.format(
            self.list_url, start, end)
        response = self.c.get(url)

        ids_result = {i['id'] for i in response.data}
        self.assertEqual(ids_result, expected)
    def test_get_with_engine_range_return_correct_list(self):
        car = self.cars[0]
        start, end = car.engine - 100, car.engine + 100

        expected = {i.id for i in  models.Vehicle.objects.filter(
            engine__gte=start,
            engine__lte=end)}

        url = '{}?engine_start={}&engine_end={}'.format(
            self.list_url, start, end)
        response = self.c.get(url)

        ids_result = {i['id'] for i in response.data}
        self.assertEqual(ids_result, expected)

    def test_get_with_mileage_range_return_correct_list(self):
        car = self.cars[0]
        start, end = car.mileage - 500, car.mileage + 500

        expected = {i.id for i in  models.Vehicle.objects.filter(
            mileage__gte=start,
            mileage__lte=end)}

        url = '{}?mileage_start={}&mileage_end={}'.format(
            self.list_url, start, end)
        response = self.c.get(url)

        ids_result = {i['id'] for i in response.data}
        self.assertEqual(ids_result, expected)

    def test_call_post_must_create_an_item(self):
        model = factories.VehicleModelFactory()

        data = dict(
            model=model.id,
            color='red',
            mileage=144000,
            engine=1000
        )

        response = self.c.post(self.list_url, data=data)
        self.assertEqual(response.status_code, 201)

        models.Vehicle.objects.get(model=model, color='red',
                                   mileage=144000, engine=1000)

    def test_call_patch_must_update_an_item(self):
        vehicle = self.cars[0]

        new_mileage = vehicle.mileage + 1000

        data = dict(
            mileage=new_mileage
        )

        url = reverse('api:vehicle-detail', args=[vehicle.id])
        response = self.c.patch(url, data=json.dumps(data),
                                content_type='application/json')
        self.assertEqual(response.status_code, 200)

        vehicle.refresh_from_db()
        self.assertEqual(vehicle.mileage, new_mileage)

    def test_call_delete_must_delete_an_item(self):
        vehicle = self.cars[0]

        url = reverse('api:vehicle-detail', args=[vehicle.id])
        response = self.c.delete(url)

        self.assertEqual(response.status_code, 204)

        self.assertIsNone(models.Vehicle.objects.filter(id=vehicle.id).first())
