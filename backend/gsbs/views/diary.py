from datetime import datetime

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .. import serializers
from ..models import Diary


class DiaryViewSet(viewsets.ModelViewSet):
    queryset = Diary.objects.all()
    serializer_class = serializers.DiarySerializer

    def retrieve(self, request, *args, **kwargs):
        diary = Diary.objects.filter(
            user=request.user, date=kwargs['pk']).first()
        if diary:
            serializer = self.get_serializer(diary)
            return Response(Diary.change_key_name(serializer.data))
        return Response(None)

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            wake_up_time=datetime.strptime(
                self.request.data['wake_up_time'], '%H:%M'
            ),
            bedtime=datetime.strptime(
                self.request.data['bedtime'], '%H:%M'
            )
        )

    def perform_update(self, serializer):
        serializer.save(
            wake_up_time=datetime.strptime(
                self.request.data['wake_up_time'], '%H:%M'
            ),
            bedtime=datetime.strptime(
                self.request.data['bedtime'], '%H:%M'
            )
        )

    @action(methods=['get'], detail=False)
    def calendar_events(self, request):
        events = Diary.select_calendar_events(
            request.user,
            request.query_params.get('start_date'),
            request.query_params.get('end_date')
        )
        return Response(events)

    @action(methods=['get'], detail=False)
    def nutrition_per_day(self, request):
        data = Diary.compute_nutrition_per_day(request.user)
        return Response(data)
