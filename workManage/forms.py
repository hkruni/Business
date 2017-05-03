# -*-coding:utf-8-*-
from django import forms

GENDER_CHOICES = (
    (u'M', u'男'),#分别为数据库存储的值和前台界面显示的值
    (u'F', u'女'),
)
class AddWorkerForm(forms.Form):

    name = forms.CharField(label='姓名',widget=forms.TextInput(attrs={'class':'special'}),required=True)
    sex = forms.CharField(label='性别',widget=forms.Select(choices = GENDER_CHOICES),required=True)
    tel = forms.CharField(label='联系方式',widget=forms.TextInput(attrs={'class':'special'}),required=True)
    startDate = forms.DateField(label='入职时间',required=True)
    email = forms.EmailField(label='邮件',required=False)
    
class AddCompanyForm(forms.Form):

    name = forms.CharField(label='公司名称',required=True)
    address = forms.CharField(label='公司地址',required=True,)
    headPeople = forms.CharField(label='负责人',required=True,)
    tel = forms.CharField(label='联系方式',required=True,) 
    remark = forms.CharField(label = '备注',required=False)#默认是required=True，所以False时必须注明
    

class AddOrderForm(forms.Form):
    name = forms.CharField(label='公司名称',required=True)
    address = forms.CharField(label='公司地址',required=True,)
    product = forms.CharField(label='货物名称',required=True,)
    num = forms.CharField(label='数量',required=True,) 
    price = forms.CharField(label = '单价',required=False)#默认是required=True，所以False时必须注明   
    
    
    
    
    