from django.test import TestCase

from api import serializers as sls
from api import factories, models


class AutoMakerSerializerTestCase(TestCase):

    def test_data_must_have_expected_fields(self):
        automaker = factories.AutoMakerFactory()
        serializer = sls.AutoMakerSerializer(automaker)

        expected_fields = {'id', 'name'}
        self.assertEqual(set(dict(serializer.data).keys()), expected_fields)

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


class VehicleModelSerializerTestCase(TestCase):

    def test_data_must_have_expected_fields(self):
        model = factories.VehicleModelFactory()
        serializer = sls.VehicleModelSerializer(model)

        expected_fields = {'id', 'auto_maker', 'auto_maker_info',
                           'year', 'name', 'model_type'}
        self.assertEqual(set(dict(serializer.data).keys()), expected_fields)

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
