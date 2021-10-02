from rest_framework import serializers
from ..models import Meal


class MealSerializer(serializers.ModelSerializer):
    company_name = serializers.ReadOnlyField(source='company.name',
                                             read_only=True)

    class Meta:
        model = Meal
        fields = [
            'id', 'company', 'company_name', 'name', 'price', 'calorie',
            'protein', 'carbohydrate', 'sugar', 'lipid', 'dietary_fiber',
            'salt', 'is_bad', 'url', 'img'
        ]
        extra_kwargs = {'img': {'read_only': True}}
