from rest_framework import serializers
from ..models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    created_on = serializers.DateTimeField(
        format='%Y-%m-%d %H:%M', read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'username', 'user', 'created_on', 'img']
        extra_kwargs = {'user': {'read_only': True}}
