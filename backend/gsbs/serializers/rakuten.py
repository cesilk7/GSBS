from rest_framework import serializers
from ..models import RakutenCardPaymentHistory


class RakutenSerializer(serializers.ModelSerializer):
    class Meta:
        model = RakutenCardPaymentHistory
        fields = '__all__'
        read_only_fields = ['payment_date', 'payment_row', 'store_name', 'user', 'payment_method', 'payment']
