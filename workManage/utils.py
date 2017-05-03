#encoding=utf-8
'''
Created on 2017年4月23日

@author: Administrator
'''

import calendar
from datetime import date

def getCurrentStartAndEnd(d):
    start,end = calendar.monthrange(d.year,d.month)
    print str(start) + ':' + str(end)
    startDate = date(d.year,d.month,1)
    endDate = date(d.year,d.month,end)
    return startDate,endDate


def getLastStartAndEnd(d):
    start,end = calendar.monthrange(d.year,d.month - 1)
    print str(start) + ':' + str(end)
    startDate = date(d.year,d.month - 1,1)
    endDate = date(d.year,d.month -1,end)
    return startDate,endDate

def getRecentTwoMonth(d):
    start,end = calendar.monthrange(d.year,d.month)
    startDate = date(d.year,d.month - 1,1)
    endDate = date(d.year,d.month,end)
    return startDate,endDate




