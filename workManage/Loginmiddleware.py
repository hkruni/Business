#encoding=utf-8

from django.http import HttpResponseRedirect   
from django.contrib.auth import SESSION_KEY   
from urllib import quote   
class QtsAuthenticationMiddleware(object):   
    def process_request(self, request):  
        if request.path != '/login':   
            
            username = request.session.get('username','')
            if username != '':
                pass
            else:  
                return HttpResponseRedirect("/login") 
