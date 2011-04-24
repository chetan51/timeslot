from django.http import HttpResponse
from django.http import Http404
from django.template import Context, loader

def index(request):
    template = loader.get_template('agenda_detail.html')
    context = Context()
    return HttpResponse(template.render(context))
