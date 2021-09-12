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
    queryset = Meal.objects.all()
    serializer_class = serializers.MealSerializer

    @action(detail=False, methods=['put'])
    def multiple_update(self, request):
        pass

    @action(detail=False, methods=['put'])
    def multiple_delete(self, request):
        ids = request.data
        meals = Meal.objects.filter(id__in=ids)
        if meals:
            meals.delete()
            return Response(ids)
        return Response([0])

    def destroy(self, request, *args, **kwargs):
        response = {
            'message': 'DELETE method of single model instance is not allowed'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)


class DiaryViewSet(viewsets.ModelViewSet):
    queryset = Diary.objects.all()
    serializer_class = serializers.DiarySerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
