from django.test import TestCase

from api import serializers as sls
from api import factories, models


class SerializerTestCase(TestCase):

    def assertHasFields(self, serializer, expected_fields):
        self.assertEqual(set(dict(serializer.data).keys()), set(expected_fields))


class AutoMakerSerializerTestCase(SerializerTestCase):

    def test_data_must_have_expected_fields(self):
        automaker = factories.AutoMakerFactory()
        serializer = sls.AutoMakerSerializer(automaker)

        self.assertHasFields(serializer, ['id', 'name'])

    def test_data_must_be_with_expected_data(self):
        automaker = factories.AutoMakerFactory()
        serializer = sls.AutoMakerSerializer(automaker)

        data = serializer.data

        self.assertEqual(data['id'], automaker.id)
        self.assertEqual(data['name'], automaker.name)

    def test_save_must_create_new_object(self):
        self.assertEqual(models.AutoMaker.objects.all().count(), 0)

        data = {'name': 'Toyota'}
        serializer = sls.AutoMakerSerializer(data=data)
        serializer.is_valid()
        result = serializer.save()

        self.assertIsInstance(result, models.AutoMaker)
        self.assertEqual(result.id, 1)

    def test_save_must_not_accept_id_in_data(self):
        data = {'name': 'Toyota', 'id': 999}
        serializer = sls.AutoMakerSerializer(data=data)

        serializer.is_valid()
        result = serializer.save()

        self.assertEqual(result.id, 1)


class VehicleModelSerializerTestCase(SerializerTestCase):

    def test_data_must_have_expected_fields(self):
        model = factories.VehicleModelFactory()
        serializer = sls.VehicleModelSerializer(model)

        expected_fields = ['id', 'auto_maker', 'auto_maker_info',
                           'year', 'name', 'model_type']
        self.assertHasFields(serializer, expected_fields)

    def test_data_must_be_with_expected_data(self):
        model = factories.VehicleModelFactory()
        serializer = sls.VehicleModelSerializer(model)

        self.assertEqual(serializer.data['id'], model.id)
        self.assertEqual(serializer.data['name'], model.name)
        self.assertEqual(serializer.data['year'], model.year)
        self.assertEqual(serializer.data['model_type'], model.model_type)
        self.assertEqual(serializer.data['auto_maker'], model.auto_maker_id)

        automaker_serializer = sls.AutoMakerSerializer(model.auto_maker)
        self.assertEqual(serializer.data['auto_maker_info'], automaker_serializer.data)

    def test_save_must_create_new_object(self):
        auto_maker = factories.AutoMakerFactory()
        data = dict(
            year=1997,
            name='Corsa',
            auto_maker=auto_maker.id,
            model_type=models.VehicleModel.TYPE_CAR
        )

        serializer = sls.VehicleModelSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        result = serializer.save()

        self.assertIsInstance(result, models.VehicleModel)


class VehicleSerializerTestCase(SerializerTestCase):

    def test_data_must_have_expected_fields(self):
        vehicle = factories.VehicleFactory()
        serializer = sls.VehicleSerializer(vehicle)

        expected_fields = ['id', 'color', 'model', 'mileage', 'engine', 'model_info']
        self.assertHasFields(serializer, expected_fields)

    def test_data_must_have_model_info_as_vehicle_model_serializer(self):
        vehicle = factories.VehicleFactory()

        serializer = sls.VehicleSerializer(vehicle)

        model_serializer = sls.VehicleModelSerializer(vehicle.model)

        self.assertEqual(serializer.data['model_info'], model_serializer.data)
