import datetime
from itertools import chain

from django.db import models
from django.db.models import F, Sum, Value
from django.conf import settings
from django_pandas.io import read_frame

from .meal import Meal


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
        # not meal data
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

        red_text = cls.objects \
            .annotate(title=Value('MISSION OUT', output_field=models.CharField())) \
            .values('title', 'date') \
            .filter(comment__icontains='MISSION OUT')

        return list(chain(calorie_1, calorie_2, weight_list, red_text))

    @classmethod
    def compute_nutrition_per_day(cls, user):
        # The day this service started to be used
        start = '2021-10-3'
        data = cls.objects.values('date', 'morning_weight', 'night_weight') \
            .annotate(sum_calorie=Sum('ate_meal__calorie'), sum_dietary_fiber=Sum('ate_meal__dietary_fiber')) \
            .filter(user=user, date__gte=start).order_by('date')
        df = read_frame(data, fieldnames=['date', 'morning_weight', 'night_weight', 'sum_calorie', 'sum_dietary_fiber'])
        return df
