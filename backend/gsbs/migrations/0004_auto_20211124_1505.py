# Generated by Django 3.2.6 on 2021-11-24 06:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gsbs', '0003_rename_order_column_no_amazonpurchasehistory_order_row'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='amazonpurchasehistory',
            name='order_number_unique',
        ),
        migrations.AddConstraint(
            model_name='amazonpurchasehistory',
            constraint=models.UniqueConstraint(fields=('order_number', 'order_row'), name='order_number_unique'),
        ),
    ]
