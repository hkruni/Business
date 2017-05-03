# coding=utf-8

from django.conf.urls import  url
from . import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^login', views.login),
    url(r'^logout', views.logout),
    url(r'^index$', views.table),
    url(r'^getOrderNumByYear$', views.getOrderNumByYear),
    url(r'^addWorker', views.addWorker),
    url(r'^deleteWorker', views.deleteWorker),
    url(r'^order', views.order),
    url(r'^company', views.company),
    url(r'^salary', views.salary),
    url(r'^addCompany', views.addCompany),
    url(r'^getCompanyInfo', views.getCompanyInfo),
    url(r'^getCompanyName', views.getCompanyName),
    url(r'^getWorkerName', views.getWorkerName),
    url(r'^getSalary', views.getSalary),
    url(r'^getWorker', views.getWorker),
    url(r'^getBreakDate', views.getBreakDate),
    url(r'^getOrder', views.getOrder),
    url(r'^getAttendance', views.getAttendance),
    url(r'^addSalary', views.addSalary),
    url(r'^addAttendance', views.addAttendance),
    url(r'^deleteCompany', views.deleteCompany),
    url(r'^deleteSalary', views.deleteSalary),
    url(r'^deleteAttendance', views.deleteAttendance),
    url(r'^getProductName', views.getProductName),
    url(r'^addOrder', views.addOrder),
    url(r'^deleteOrder', views.deleteOrder),
    url(r'^getMoney', views.getMoney),
    url(r'^addMoney', views.addMoney),
    
    
    
    
]