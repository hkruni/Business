#encoding= utf-8
from django.db import models
from docutils.nodes import note
from django.db.models.fields import CharField
from _mysql import NULL

class User(models.Model):
    username = models.CharField(u'用户名',max_length=20)
    password = models.CharField(u'密码',max_length=100)


class Worker(models.Model):
    '''
    @note:工人
    '''
    name = models.CharField(u'姓名',max_length = 10,blank = False) #blank=False表示表单验证时该字段不可以为空
    

class Attendance(models.Model):
    '''
    @note:请假
    '''
    worker = models.ForeignKey(Worker,verbose_name=u'工人')
    break_date = models.DateField(u'请假时期')
    detail = models.CharField(u'备注',max_length = 20)

class Salary(models.Model):
    '''
    @note:工资
    '''
    worker = models.ForeignKey(Worker,verbose_name=u'工人')
    money_date = models.DateField(u'请假时期')
    detail = models.CharField(u'备注',max_length = 20)
    money = models.IntegerField(u'工资')

    

class Company(models.Model):
    '''
    @note:合作公司
    '''
    name  = models.CharField(u'公司名称',max_length = 20,blank = False)
    address  = models.CharField(u'公司地址', max_length= 20,blank = False)
    headPeople = models.CharField(u'负责人', max_length= 20,blank = False)
    tel = models.CharField(u'联系方式', max_length= 20,blank = False)
    remark = models.CharField(u'备注', max_length= 20,blank = True,null = True)
    totalMoney = models.PositiveIntegerField(u'今年销售额（元）')


class Product(models.Model):
    '''
    @note 进销货物
    '''
    name = models.CharField(u'货物名称',max_length = 20,blank = False)
    type = models.SmallIntegerField(u'货物类型') #0：进货 1：供货

class Order(models.Model):
    '''
    @note:订单
    '''
    num  = models.CharField(u'数量',max_length = 20) #个或公斤
    totalPrice = models.IntegerField(u'总价')#元
    changeDate = models.DateField(u'进销货日期')
    detail = models.CharField(u'备注',max_length = 20)
    product = models.ForeignKey(Product,verbose_name=u'货物名称')
    company = models.ForeignKey(Company,verbose_name=u'公司')
    
    
class Money(models.Model):
    '''
    @note:收款回款
    '''
    totalPrice = models.IntegerField(u'总价')#元
    changeDate = models.DateField(u'回款日期')
    detail = models.CharField(u'备注',max_length = 20)
    company = models.ForeignKey(Company,verbose_name=u'公司')
    type = models.CharField(u'交易类型',max_length = 5)
    type_change = models.CharField(u'交易方式',max_length = 5)
    
