from datetime import datetime

from rest_framework import serializers
from ..models import Diary


class DiarySerializer(serializers.ModelSerializer):
    wake_up_time = serializers.SerializerMethodField()
    bedtime = serializers.SerializerMethodField()

    class Meta:
        model = Diary
        fields = [
            'id', 'date', 'wake_up_time', 'bedtime', 'morning_weight',
            'night_weight', 'ate_meal', 'comment'
        ]

    def get_wake_up_time(self, instance):
        return datetime(
            1970, 1, 1, instance.wake_up_time.hour, instance.wake_up_time.minute
        )

    def get_bedtime(self, instance):
        return datetime(
            1970, 1, 1, instance.bedtime.hour, instance.bedtime.minute
        )
