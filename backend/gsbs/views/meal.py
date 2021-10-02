from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .. import serializers
from ..models import Meal


class MealViewSet(viewsets.ModelViewSet):
    queryset = Meal.objects.order_by('id')
    serializer_class = serializers.MealSerializer

    def list(self, request, *args, **kwargs):
        query_type = request.query_params.get('query_type')
        if query_type == 'options':
            meals = Meal.select_options()
            return Response(meals)
        else:
            return super().list(self, request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        response = {
            'message': 'DELETE method of single model instance is not allowed'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['put'], detail=False)
    def multiple_update(self, request):
        ids = Meal.multiple_update(request.data)
        return Response(ids)

    @action(methods=['put'], detail=False)
    def multiple_delete(self, request):
        ids = request.data
        meals = Meal.objects.filter(id__in=ids)
        if meals:
            meals.delete()
            return Response(ids)
        return Response([0])
