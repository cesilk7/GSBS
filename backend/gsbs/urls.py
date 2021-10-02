from django.urls import path, include
from rest_framework import routers
from . import views


router = routers.DefaultRouter()
router.register('profile', views.ProfileViewSet)
router.register('company', views.CompanyViewSet)
router.register('meal', views.MealViewSet)
router.register('diary', views.DiaryViewSet)

urlpatterns = [
    path('index/', views.index),
    path('register/', views.CreateUserView.as_view(), name='register'),
    path('myprofile/', views.MyProfileListView.as_view(), name='myprofile'),
    path('', include(router.urls)),
]
