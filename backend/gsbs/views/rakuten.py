from rest_framework import viewsets

from .. import serializers
from ..models import RakutenCardPaymentHistory


class RakutenViewSet(viewsets.ModelViewSet):
    queryset = RakutenCardPaymentHistory.objects.all()
    serializer_class = serializers.RakutenSerializer
