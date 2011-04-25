from django.http import HttpResponse
from django.http import Http404
from django.template import RequestContext, loader

def index(request):
    template = loader.get_template('base_agendas.html')
    context = RequestContext(request)
    return HttpResponse(template.render(context))
