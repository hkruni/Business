from django.contrib import admin

# Register your models here.
from workManage.models import *

admin.site.register(Worker)
admin.site.register(Attendance)
admin.site.register(Salary)
admin.site.register(Company)
admin.site.register(Product)
admin.site.register(Order)