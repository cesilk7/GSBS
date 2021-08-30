from django.urls import path, include
from rest_framework import routers
from .views import CreateUserView, ProfileViewSet, MyProfileListView, \
    FoodViewSet, DiaryViewSet, test

router = routers.DefaultRouter()
router.register('profile', ProfileViewSet)
router.register('food', FoodViewSet)
router.register('diary', DiaryViewSet)

urlpatterns = [
    path('test/', test),
    path('register/', CreateUserView.as_view(), name='register'),
    path('myprofile/', MyProfileListView.as_view(), name='myprofile'),
    path('', include(router.urls)),
]
