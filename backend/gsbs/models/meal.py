from django.db import models
from django.db.models import F

from .company import Company


def upload_meal_path(instance, filename):
    return '/'.join(['meal_images', instance.company.name, filename])


class Meal(models.Model):
    class Meta:
        db_table = 'meals'

        constraints = [
            models.UniqueConstraint(
                fields=['company_id', 'name'],
                name='meal_name_unique',
            ),
        ]

        indexes = [
            models.Index(fields=['company_id', 'name'])
        ]

    company = models.ForeignKey(
        Company, related_name='companies', on_delete=models.CASCADE)
    item_no = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=100, blank=False, null=False)
    price = models.IntegerField(blank=True, null=True)
    calorie = models.IntegerField(blank=True, null=True)
    protein = models.FloatField(blank=True, null=True)
    carbohydrate = models.FloatField(blank=True, null=True)
    sugar = models.FloatField(blank=True, null=True)
    lipid = models.FloatField(blank=True, null=True)
    dietary_fiber = models.FloatField(blank=True, null=True)
    salt = models.FloatField(blank=True, null=True)
    is_bad = models.BooleanField()
    url = models.CharField(max_length=256, default='', blank=True, null=True)
    img = models.ImageField(blank=True, null=True, upload_to=upload_meal_path)

    def __str__(self):
        return self.company.name + ' ' + self.name

    @classmethod
    def select_options(cls):
        data = cls.objects \
            .annotate(value=F('id'), label=F('name')) \
            .values('value', 'label', 'company__name')
        for i in range(len(data)):
            data[i]['label'] = data[i]['company__name'] + ':' + data[i]['label']
        return data

    @classmethod
    def multiple_update(cls, data):
        rows = sorted(data, key=lambda x: x['id'])
        ids = [row.get('id') for row in rows]
        meals = cls.objects.filter(id__in=ids).order_by('id')

        update_meals = []
        for i, meal in enumerate(meals):
            meal.name = rows[i]['name']
            meal.price = rows[i]['price']
            meal.calorie = rows[i]['calorie']
            meal.protein = rows[i]['protein']
            meal.sugar = rows[i]['sugar']
            update_meals.append(meal)
        cls.objects.bulk_update(
            update_meals,
            fields=['name', 'price', 'calorie', 'protein', 'sugar'])
        return ids
