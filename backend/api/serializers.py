from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Profile, Company, Meal, Diary


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user


class ProfileSerializer(serializers.ModelSerializer):
    created_on = serializers.DateTimeField(format='%Y-%m-%d %H:%M',
                                           read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'username', 'user', 'created_on', 'img']
        extra_kwargs = {'user': {'read_only': True}}


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name']


class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ['id', 'company', 'name', 'price', 'calorie', 'protein',
                  'carbohydrate', 'sugar', 'lipid', 'dietary_fiber', 'salt',
                  'is_bad']


class DiarySerializer(serializers.ModelSerializer):
    wake_up_time = ('', serializers.TimeField(format='%H:%M'))
    bedtime = ('', serializers.TimeField(format='%H:%M'))

    class Meta:
        model = Diary
        fields = ['id', 'user', 'date', 'wake_up_time', 'bedtime',
                  'morning_weight',
                  'night_weight', 'ate_meal', 'comment']
        extra_kwargs = {'user': {'read_only': True}}

    def create(self, validated_data):
        pass
