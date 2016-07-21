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
