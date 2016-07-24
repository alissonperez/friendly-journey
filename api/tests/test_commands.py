from unittest import mock

from django.core.management import call_command
from django.test import TestCase
from api import models


class PopulateTestCase(TestCase):

    def test_call_command_must_create_auto_makers(self):
        self.assertEqual(models.AutoMaker.objects.all().count(), 0)

        with mock.patch('api.management.commands.populate.Command._out_success'):
            call_command('populate')

        self.assertGreater(models.AutoMaker.objects.all().count(), 0)

    def test_call_command_must_create_models(self):
        self.assertEqual(models.VehicleModel.objects.all().count(), 0)

        with mock.patch('api.management.commands.populate.Command._out_success'):
            call_command('populate')

        self.assertGreater(models.VehicleModel.objects.all().count(), 0)

    def test_call_command_must_create_cars(self):
        self.assertEqual(models.Vehicle.objects.filter(
            model__model_type=models.VehicleModel.TYPE_CAR).count(), 0)

        with mock.patch('api.management.commands.populate.Command._out_success'):
            call_command('populate')

        self.assertGreater(models.Vehicle.objects.filter(
            model__model_type=models.VehicleModel.TYPE_CAR).count(), 0)

    def test_call_command_must_create_motorcycles(self):
        self.assertEqual(models.Vehicle.objects.filter(
            model__model_type=models.VehicleModel.TYPE_MOTOCYCLE).count(), 0)

        with mock.patch('api.management.commands.populate.Command._out_success'):
            call_command('populate')

        self.assertGreater(models.Vehicle.objects.filter(
            model__model_type=models.VehicleModel.TYPE_MOTOCYCLE).count(), 0)
