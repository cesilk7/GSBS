from itertools import chain

from django.db import models
from django.db.models import F
from django.db.models import Sum
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import PermissionsMixin
import uuid

from django.conf import settings


def upload_avatar_path(instance, filename):
    ext = filename.split('.')[-1]
    return '/'.join(['avatars',
                     str(instance.user.id) +
                     str(instance.username) + '.' +
                     str(ext)])


def upload_meal_path(instance, filename):
    return '/'.join(['meal_images', instance.company.name, filename])


class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('email is must')

        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    class Meta:
        db_table = 'users'

    email = models.EmailField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email


class Profile(models.Model):
    class Meta:
        db_table = 'profiles'

    username = models.CharField(max_length=20)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, related_name='user',
        on_delete=models.CASCADE
    )
    created_on = models.DateTimeField(auto_now_add=True)
    img = models.ImageField(blank=True, null=True, upload_to=upload_avatar_path)

    def __str__(self):
        return self.username


class Company(models.Model):
    class Meta:
        db_table = 'companies'

    name = models.CharField(max_length=100, blank=False, null=False)

    def __str__(self):
        return self.name


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
        return cls.objects \
            .annotate(value=F('id'), label=F('name')) \
            .values('value', 'label')

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


class Diary(models.Model):
    class Meta:
        db_table = 'diaries'
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'date'],
                name='user_date'
            )
        ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='owner',
        on_delete=models.CASCADE
    )
    date = models.DateField(null=False, blank=False)
    wake_up_time = models.TimeField(blank=True, null=True)
    bedtime = models.TimeField(blank=True, null=True)
    morning_weight = models.FloatField(blank=True, null=True)
    night_weight = models.FloatField(blank=True, null=True)
    ate_meal = models.ManyToManyField(
        Meal, related_name='ate_meal', blank=True,
        db_table='diary_ate_meal'
    )
    total_calorie = models.IntegerField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email + ' : ' + self.date.strftime('%Y-%m-%d')

    @classmethod
    def change_key_name(cls, diary):
        diary['ate_meal'] = Meal.select_options().filter(
            id__in=diary['ate_meal'])
        return diary

    @classmethod
    def select_calendar_events(cls, user, start, end):
        calorie_1 = cls.objects \
            .select_related() \
            .values('date') \
            .annotate(title=Sum('ate_meal__calorie')) \
            .filter(user=user, total_calorie__isnull=True,
                    date__gte=start, date__lt=end)
        calorie_2 = cls.objects \
            .annotate(title=F('total_calorie')) \
            .values('title', 'date') \
            .filter(user=user, total_calorie__isnull=False,
                    date__gte=start, date__lt=end)

        weight_list = []
        morning_weight = cls.objects \
            .annotate(title=F('morning_weight')) \
            .values('title', 'date') \
            .filter(user=user, date__gte=start, date__lt=end)
        for data in morning_weight:
            weight_list.append({
                'date': data['date'],
                'title': 'M: ' + str(data['title']) + ' kg'
            })

        return list(chain(calorie_1, calorie_2, weight_list))
