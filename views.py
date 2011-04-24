from django.http import HttpResponseRedirect
from django.http import Http404
from django.template import Context, loader

def index(request):
    return HttpResponseRedirect("/agendas/")
