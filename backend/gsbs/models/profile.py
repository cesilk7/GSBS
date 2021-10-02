from django.db import models
from django.conf import settings


def upload_avatar_path(instance, filename):
    ext = filename.split('.')[-1]
    return '/'.join(['avatars',
                     str(instance.user.id) +
                     str(instance.username) + '.' +
                     str(ext)])


class Profile(models.Model):
    class Meta:
        db_table = 'profiles'

    username = models.CharField(max_length=20)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, related_name='user',
        on_delete=models.CASCADE
    )
    created_on = models.DateTimeField(auto_now_add=True)
    img = models.ImageField(blank=True, null=True, upload_to=upload_avatar_path)

    def __str__(self):
        return self.username
