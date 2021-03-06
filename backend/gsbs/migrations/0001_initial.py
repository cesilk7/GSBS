# Generated by Django 3.2.6 on 2021-11-08 13:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import gsbs.models.meal
import gsbs.models.profile


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('email', models.EmailField(max_length=50, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'db_table': 'users',
            },
        ),
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'companies',
            },
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=20)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('img', models.ImageField(blank=True, null=True, upload_to=gsbs.models.profile.upload_avatar_path)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='user', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'profiles',
            },
        ),
        migrations.CreateModel(
            name='Meal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_no', models.IntegerField(blank=True, null=True)),
                ('name', models.CharField(max_length=100)),
                ('price', models.IntegerField(blank=True, null=True)),
                ('calorie', models.IntegerField(blank=True, null=True)),
                ('protein', models.FloatField(blank=True, null=True)),
                ('carbohydrate', models.FloatField(blank=True, null=True)),
                ('sugar', models.FloatField(blank=True, null=True)),
                ('lipid', models.FloatField(blank=True, null=True)),
                ('dietary_fiber', models.FloatField(blank=True, null=True)),
                ('salt', models.FloatField(blank=True, null=True)),
                ('is_bad', models.BooleanField()),
                ('url', models.CharField(blank=True, default='', max_length=256, null=True)),
                ('img', models.ImageField(blank=True, null=True, upload_to=gsbs.models.meal.upload_meal_path)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='companies', to='gsbs.company')),
            ],
            options={
                'db_table': 'meals',
            },
        ),
        migrations.CreateModel(
            name='Diary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('wake_up_time', models.TimeField(blank=True, null=True)),
                ('bedtime', models.TimeField(blank=True, null=True)),
                ('morning_weight', models.FloatField(blank=True, null=True)),
                ('night_weight', models.FloatField(blank=True, null=True)),
                ('total_calorie', models.IntegerField(blank=True, null=True)),
                ('comment', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('ate_meal', models.ManyToManyField(blank=True, db_table='diary_ate_meal', related_name='ate_meal', to='gsbs.Meal')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owner', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'diaries',
            },
        ),
        migrations.AddIndex(
            model_name='meal',
            index=models.Index(fields=['company_id', 'name'], name='meals_company_7ad7c4_idx'),
        ),
        migrations.AddConstraint(
            model_name='meal',
            constraint=models.UniqueConstraint(fields=('company_id', 'name'), name='meal_name_unique'),
        ),
        migrations.AddConstraint(
            model_name='diary',
            constraint=models.UniqueConstraint(fields=('user', 'date'), name='user_date'),
        ),
    ]
