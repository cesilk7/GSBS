from datetime import datetime

from django.shortcuts import render
from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.permissions import AllowAny
from . import serializers
from .models import Profile, Company, Meal, Diary


def test(request):
    return render(request, 'index.html')


class CreateUserView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = (AllowAny,)


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MyProfileListView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = serializers.CompanySerializer


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
