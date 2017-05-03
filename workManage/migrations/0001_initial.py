# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-19 15:46
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20, verbose_name='\u516c\u53f8\u540d\u79f0')),
                ('address', models.CharField(max_length=20, verbose_name='\u516c\u53f8\u5730\u5740')),
                ('headPeople', models.CharField(max_length=20, verbose_name='\u8d1f\u8d23\u4eba')),
                ('tel', models.CharField(max_length=20, verbose_name='\u8054\u7cfb\u65b9\u5f0f')),
                ('remark', models.CharField(blank=True, max_length=20, null=True, verbose_name='\u5907\u6ce8')),
                ('totalMoney', models.PositiveIntegerField(verbose_name='\u4eca\u5e74\u9500\u552e\u989d\uff08\u5143\uff09')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('num', models.CharField(max_length=20, verbose_name='\u6570\u91cf')),
                ('totalPrice', models.IntegerField(verbose_name='\u603b\u4ef7')),
                ('changeDate', models.DateField(verbose_name='\u8fdb\u9500\u8d27\u65e5\u671f')),
                ('detail', models.CharField(max_length=20, verbose_name='\u5907\u6ce8')),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='workManage.Company', verbose_name='\u516c\u53f8')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20, verbose_name='\u8d27\u7269\u540d\u79f0')),
                ('type', models.SmallIntegerField(verbose_name='\u8d27\u7269\u7c7b\u578b')),
            ],
        ),
        migrations.CreateModel(
            name='Worker',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=10, verbose_name='\u59d3\u540d')),
                ('tel', models.CharField(max_length=11, verbose_name='\u624b\u673a\u53f7\u7801')),
                ('sex', models.CharField(choices=[('M', '\u7537'), ('F', '\u5973')], max_length=11, verbose_name='\u6027\u522b')),
                ('startDate', models.DateField(verbose_name='\u5f00\u59cb\u5de5\u4f5c\u65f6\u95f4')),
                ('email', models.EmailField(blank=True, max_length=254, null=True, verbose_name='\u7535\u5b50\u90ae\u4ef6')),
            ],
        ),
        migrations.AddField(
            model_name='order',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='workManage.Product', verbose_name='\u8d27\u7269\u540d\u79f0'),
        ),
    ]
