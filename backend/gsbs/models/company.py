from django.db import models


class Company(models.Model):
    class Meta:
        db_table = 'companies'

    name = models.CharField(max_length=100, blank=False, null=False)

    def __str__(self):
        return self.name
