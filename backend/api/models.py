from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import uuid

from django.conf import settings


def upload_avatar_path(instance, filename):
    ext = filename.split('.')[-1]
    return '/'.join(['avatars', str(instance.user.id)+str(instance.username)+str()+str(ext)])


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

    company = models.ForeignKey(
        Company, related_name='companies', on_delete=models.CASCADE)
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

    def __str__(self):
        return self.company.name + ' ' + self.name


class Diary(models.Model):
    class Meta:
        db_table = 'diaries'
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'date'],
                name='user_date'
            )
        ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField(null=False, blank=False)
    wake_up_time = models.TimeField(blank=True, null=True)
    bedtime = models.TimeField(blank=True, null=True)
    morning_weight = models.FloatField(blank=True, null=True)
    night_weight = models.FloatField(blank=True, null=True)
    ate_meal = models.ManyToManyField(
        Meal, related_name='ate_meal', blank=True,
        db_table='diary_ate_meal'
    )
    comment = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email + ' : ' + self.date.strftime('%Y-%m-%d')
