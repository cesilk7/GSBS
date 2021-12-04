# Generated by Django 3.2.6 on 2021-11-24 06:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gsbs', '0004_auto_20211124_1505'),
    ]

    operations = [
        migrations.CreateModel(
            name='RakutenCardPaymentHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('payment_date', models.DateField()),
                ('payment_row', models.IntegerField()),
                ('store_name', models.CharField(max_length=64)),
                ('user', models.CharField(max_length=64)),
                ('payment_method', models.CharField(max_length=64)),
                ('payment', models.IntegerField()),
            ],
            options={
                'db_table': 'rakuten_card_payment_history',
            },
        ),
        migrations.AddConstraint(
            model_name='rakutencardpaymenthistory',
            constraint=models.UniqueConstraint(fields=('payment_date', 'payment_row'), name='payment_unique'),
        ),
    ]