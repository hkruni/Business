#encoding=utf-8
from datetime import datetime, date
import json

from amqp.spec import method
from django.core.exceptions import ObjectDoesNotExist
from django.http.response import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.views.decorators.csrf import csrf_exempt

from forms import AddCompanyForm
from forms import AddWorkerForm 
from models import *
from utils import *


def index(request):
    username = request.session.get('username','')
    if username != '':#已经登录
        return HttpResponseRedirect('/index')
    else :
        return HttpResponseRedirect('/login')


def login(request):
    username = request.POST.get('username','')
    password = request.POST.get('password','')
    
    if username == '' or password == '':
        return render(request, 'login.html')
    user = None
    try:
        user = User.objects.get(username = username)
    except ObjectDoesNotExist:#用户不存在
        return render(request, 'login.html')
    
    if user != None and password == user.password :
        request.session['username'] = username
        request.session.save()
        return HttpResponseRedirect('/index')
    else :#密码不对
        return HttpResponseRedirect('/login')
    
    
def logout(request):
    del request.session['username']
    return HttpResponseRedirect('/login')


def table(request):
    form = AddWorkerForm()
    return  render(request, 'index.html',{'form': form})

def order(request):
    return  render(request, 'order.html')

def company(request):
    return  render(request, 'company.html')

def salary(request):
    return  render(request, 'salary.html')


def getAttendance(request):
    offset = int(request.GET.get('offset',''))
    limit = int(request.GET.get('limit',''))
    
    attendancies = Attendance.objects.all()
    datalist = []
    for item in attendancies[offset:offset + limit]:
        datalist.append({
            'id':           item.pk,
            'name':         item.worker.id,
            'date':         str(item.break_date),
            'detail':       item.detail
        })
    return HttpResponse(json.dumps({'total':attendancies.count(),'rows': datalist}))
@csrf_exempt
def getBreakDate(request):
    name = request.POST.get('name')
    month = request.POST.get('month')
    datalist = []
    dates = Attendance.objects.filter(worker__name = name).filter(break_date__contains = month)
    for item in dates:
        datalist.append(str(item.break_date).split('-')[-1])
    return HttpResponse(json.dumps({'total':dates.count(),'rows': datalist}))

def getSalary(request):
    offset = int(request.GET.get('offset',''))
    limit = int(request.GET.get('limit',''))
    
    salaries = Salary.objects.all().order_by('-money_date')
    datalist = []
    for item in salaries[offset:offset + limit]:
        datalist.append({
            'id':           item.pk,
            'name':         item.worker.id,
            'date':         str(item.money_date),
            'money':        item.money,
            'detail':       item.detail
        })
    return HttpResponse(json.dumps({'total':salaries.count(),'rows': datalist}))

def getWorker(request):
    
    datalist = []
    today = date.today();
    start,end = getRecentTwoMonth(today)
    
    sql = '''
            select a.id as id,w.name,left(a.break_date,7) month,count(1) break_day,if(s.money is not null,money,0) month_money
            from workmanage_attendance a
            LEFT JOIN workmanage_worker w on a.worker_id=w.id
            LEFT JOIN workmanage_salary s on s.worker_id=a.worker_id and left(a.break_date,7) = left(s.money_date,7)
            where a.break_date between '%s' and '%s'
            GROUP BY a.worker_id,left(a.break_date,7)
            order by left(a.break_date,7),a.worker_id''' %(start,end)
    
    for item in Attendance.objects.raw(sql):
        datalist.append({
            'name':item.name,             
            'month':item.month,             
            'break':item.break_day,             
            'month_money':item.month_money,             
        })
    return HttpResponse(json.dumps({'total':len(datalist),'rows': datalist}))
'''
获取工人姓名
'''
def getWorkerName(request):
    
    workers = Worker.objects.all()
    datalist = []
    for item in workers:
        datalist.append({
            'id':           item.pk,
            'name':         item.name,
        })
    #bootstrap-table需要向前台传递total和rows两个参数
    return HttpResponse(json.dumps({'total':workers.count(),'rows': datalist}))

@csrf_exempt
def addAttendance(request):
    if request.method == 'POST':
        id = request.POST.get('id','')
        name_id = int(request.POST.get('name',''))
        break_date = request.POST.get('break_date','')
        detail = request.POST.get('detail','')
        
        worker = Worker.objects.get(pk = name_id)
        if id == '':
            attendance = Attendance(break_date = break_date,detail = detail,worker = worker)
            attendance.save()
        else:
            attendance = Attendance.objects.filter(pk = int(id))
            attendance.update(break_date = break_date,detail = detail,worker = worker)
    return HttpResponse(json.dumps({'message':'success'}))


@csrf_exempt
def addSalary(request):
    if request.method == 'POST':
        id = request.POST.get('id','')
        name_id = int(request.POST.get('name',''))
        money_date = request.POST.get('money_date','')
        detail = request.POST.get('detail','')
        money = request.POST.get('money','')
        
        worker = Worker.objects.get(pk = name_id)
        if id == '':
            salary = Salary(money_date = money_date,detail = detail,worker = worker,money = money)
            salary.save()
        else:
            salary = Salary.objects.filter(pk = int(id))
            salary.update(money_date = money_date,detail = detail,worker = worker,money = money)

    return HttpResponse(json.dumps({'message':'success'}))

def addWorker(request):
    if request.method == 'POST':
        id = int(request.POST.get('id',''))
        form = AddWorkerForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            sex = form.cleaned_data['sex']
            tel = form.cleaned_data['tel']
            startDate = form.cleaned_data['startDate']
            email = form.cleaned_data['email']
            
            if(id == 0):
                worker = Worker(name = name,sex = sex,tel = tel,startDate=startDate,email = email)
                worker.save();
            else:
                Worker.objects.filter(pk=id).update(name = name,sex = sex,tel = tel,startDate = startDate,email = email)
#                 worker.name = name;
#                 worker.sex = sex;
#                 worker.tel = tel;
#                 worker.startDate = startDate;
#                 worker.email = email;
#                 worker.save();
                
    return HttpResponseRedirect('/')

@csrf_exempt
def deleteWorker(request):
    id = request.POST.get('id')
    Worker.objects.get(pk=id).delete()
    return HttpResponse(json.dumps({'message':'success'}))

@csrf_exempt
def deleteSalary(request):
    id = request.POST.get('id')
    Salary.objects.get(pk=id).delete()
    return HttpResponse(json.dumps({'message':'success'}))

@csrf_exempt
def deleteAttendance(request):
    id = request.POST.get('id')
    Attendance.objects.get(pk=id).delete()
    return HttpResponse(json.dumps({'message':'success'}))

'''
获取公司信息
'''
def getCompanyInfo(request):
    
    offset = int(request.GET.get('offset',''))
    limit = int(request.GET.get('limit',''))
    
    print date.today().year
    sql = '''
            select t1.id id,t1.name,t1.address,t1.headPeople,t1.tel,t1.remark,if(t1.sell is null,0,t1.sell) sell ,if(t2.get is null,0,t2.get) get from
            (select c.id,c.name,c.address,c.headPeople,c.tel,c.remark,sum(m.totalPrice) sell
            from workmanage_company  c
            LEFT JOIN workmanage_money m on c.id=m.company_id
            where m.changeDate like '{0}%%'
            GROUP BY m.company_id)t1
            left join
            (select c.id,sum(o.totalPrice) get
            from workmanage_company  c
            LEFT JOIN workmanage_order o on c.id=o.company_id
            where o.changeDate like '{1}%%'
            GROUP BY o.company_id)t2
            on t1.id=t2.id;'''.format(date.today().year,date.today().year)
    
    
    companys = Company.objects.raw(sql)
    datalist = []
    for item in companys[offset:offset + limit]:
        datalist.append({
            'id':           item.id,
            'name':         item.name,
            'headPeople':   item.headPeople,
            'address':      item.address,
            'tel':          item.tel,
            'remark':       item.remark,
            'sell':         str(item.sell),
            'get':          str(item.get),
        })
    #bootstrap-table需要向前台传递total和rows两个参数
    return HttpResponse(json.dumps({'total':len(datalist),'rows': datalist}))

'''
获取公司名称
'''
@csrf_exempt
def getCompanyName(request):
    
    query = request.POST.get('name','')
    
    datalist = []
    companies = Company.objects.filter(name__contains = query)
    for item in companies:
        datalist.append({
                         'name':item.name,
                         'id':item.id
                         })
    
    return HttpResponse(json.dumps(datalist))

'''
获取公司名称
'''
@csrf_exempt
def getProductName(request):
    
    query = request.POST.get('type','')
    
    datalist = []
    if query == '':
        products = Product.objects.all()
    else :
        products = Product.objects.filter(type = int(query))
    for item in products:
        datalist.append(
                        {'name' : item.name,
                         'value' : item.pk}
                        )
    print datalist
    return HttpResponse(json.dumps(datalist))

def addCompany(request):
    if request.method == 'POST':
        id = int(request.POST.get('id',''))
        print id
        form = AddCompanyForm(request.POST)
        if form.is_valid():
            print '合格'
            name = form.cleaned_data['name']
            address = form.cleaned_data['address']
            headPeople = form.cleaned_data['headPeople']
            tel = form.cleaned_data['tel']
            remark = form.cleaned_data['remark']
            
            if(id == 0):#新增
                company = Company(name = name,address = address,headPeople = headPeople,tel=tel,remark = remark,totalMoney = 0)
                company.save();
            else:#修改
                company = Company.objects.filter(pk=id)
                totalMoney = company[0].totalMoney
                company.update(name = name,address = address,headPeople = headPeople,tel=tel,remark = remark,totalMoney = totalMoney)
        else:
            print '不合格'        
    return HttpResponseRedirect('/company')




@csrf_exempt
def deleteCompany(request):
    id = request.POST.get('id')
    Company.objects.get(pk=id).delete()
    return HttpResponse(json.dumps({'message':'success'}))



def addOrder(request):
    if request.method == 'POST':
        id = int(request.POST.get('id',''))
        name = request.POST.get('name','')
        productId = int(request.POST.get('product',''))
        num = request.POST.get('num','')
        detail = request.POST.get('detail','')
        totalPrice = request.POST.get('totalPrice','')
        changeDate = request.POST.get('changeDate','')
        
        company = Company.objects.get(pk = name)
        product = Product.objects.get(pk = productId)
        
        if(id == 0):#新增
            order = Order(company = company,product = product,detail=detail,num = num,totalPrice = totalPrice,changeDate = changeDate)
            order.save();
        else:#修改
            order = Order.objects.filter(pk=id)
            order.update(company = company,product = product,detail=detail,num = num,totalPrice = totalPrice,changeDate = changeDate)
    else:
        print '不合格'        
    return HttpResponseRedirect('/order')


def getOrder(request):
    
    offset = int(request.GET.get('offset',''))
    limit = int(request.GET.get('limit',''))
    companyId = int(request.GET.get('companyId','0'))
    productId = int(request.GET.get('productId','0'))
    startDate = request.GET.get('startDate','')
    endDate = request.GET.get('endDate','')
    
    start = datetime.strptime(startDate, "%Y-%m-%d")
    end = datetime.strptime(endDate, "%Y-%m-%d")
    
    
    orders = Order.objects.all()
    if companyId != 0:
        orders = orders.filter(company_id = companyId)
    if productId != 0:
        orders = orders.filter(product_id = productId) 
    orders = orders.filter(changeDate__range=(start, end))
    
    datalist = []
    
    for item in orders[offset:offset + limit]:
        if item.product.type == 1:
            type1 = '供货'
        else:
            type1 = '进货'
        datalist.append({
            'id':           item.pk,
            'name':         item.company.name,
            'type':         type1,
            'product':      item.product.name,
            'num':          item.num,
            'detail':        item.detail,
            'changeDate':   str(item.changeDate),
            'totalPrice':   item.totalPrice,
        })
    #bootstrap-table需要向前台传递total和rows两个参数
    return HttpResponse(json.dumps({'total':orders.count(),'rows': datalist}))

def addMoney(request):
    if request.method == 'POST':
        id = int(request.POST.get('id',''))
        name = request.POST.get('name','')
        type = request.POST.get('type','')
        type_change = request.POST.get('type_change','')
        detail = request.POST.get('detail','')
        totalPrice = request.POST.get('totalPrice','')
        changeDate = request.POST.get('changeDate','')
        
        company = Company.objects.get(pk = name)
        
        if(id == 0):#新增
            money = Money(company = company,detail=detail,type = type,type_change = type_change,totalPrice = totalPrice,changeDate = changeDate)
            money.save();
        else:#修改
            money = Money.objects.filter(pk=id)
            money.update(company = company,detail=detail,type = type,type_change = type_change,totalPrice = totalPrice,changeDate = changeDate)
    else:
        print '不合格'        
    return HttpResponseRedirect('/order?type=2')



def getMoney(request):
    offset = int(request.GET.get('offset',''))
    limit = int(request.GET.get('limit',''))
    companyId = int(request.GET.get('companyId','0'))
    startDate = request.GET.get('startDate','')
    endDate = request.GET.get('endDate','')
    
    start = datetime.strptime(startDate, "%Y-%m-%d")
    end = datetime.strptime(endDate, "%Y-%m-%d")
    
    moneys = Money.objects.all()
    if companyId !=0:
        moneys = moneys.filter(company_id = companyId)
    moneys = moneys.filter(changeDate__range=(start, end))
    datalist = []
    for item in moneys[offset:offset + limit]:
        datalist.append({
            'id':           item.pk,
            'name':         item.company.name,
            'type':         item.type,
            'type_change':  item.type_change,
            'detail':       item.detail,
            'changeDate':   str(item.changeDate),
            'totalPrice':   item.totalPrice,
        })
    #bootstrap-table需要向前台传递total和rows两个参数
    return HttpResponse(json.dumps({'total':moneys.count(),'rows': datalist}))    


@csrf_exempt
def deleteOrder(request):
    id = request.POST.get('id')
    Order.objects.get(pk=id).delete()
    return HttpResponse(json.dumps({'message':'success'}))

#图表

def getOrderNumByYear(request):
    year = request.GET.get('year','')
    
    datalist = {}
    responseData = []
    for i in Product.objects.filter(type=1):
        datalist[i.name] = [0,0,0,0,0,0,0,0,0,0,0,0]
    
    print datalist
    
    type = 1
    sql = '''select p.id as id ,p.name name,left(o.changeDate,7) month,sum(o.num) sum
          from workmanage_order o
          left join workmanage_product p on o.product_id = p.id
          where o.changeDate like '{0}%%' and p.type={1}
          GROUP BY o.product_id,left(o.changeDate,7);'''.format(year,type)
    orders = Order.objects.raw(sql)
    for item in orders:
        print item.name
        month = int(item.month[-2:].strip('0'))
        datalist[item.name][month - 1] = item.sum
        
    for k,v in datalist.items():
        responseData.append({'name':k,'value':v})
    print responseData
    return HttpResponse(json.dumps(responseData))










