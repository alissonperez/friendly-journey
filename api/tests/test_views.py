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
