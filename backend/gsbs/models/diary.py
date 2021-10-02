from itertools import chain

from django.db import models
from django.db.models import F
from django.db.models import Sum
from django.conf import settings

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
