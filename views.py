from django.http import HttpResponse, HttpResponseRedirect
from django.http import Http404
from django.template import RequestContext, loader

def index(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect("/agendas/")
    else:
        template = loader.get_template('base_landing.html')
        context = RequestContext(request)
        return HttpResponse(template.render(context))
