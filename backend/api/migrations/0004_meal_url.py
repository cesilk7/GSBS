# Generated by Django 3.2.6 on 2021-09-11 09:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20210909_1806'),
    ]

    operations = [
        migrations.AddField(
            model_name='meal',
            name='url',
            field=models.CharField(default='', max_length=256),
        ),
    ]