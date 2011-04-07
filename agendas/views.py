from django.http import HttpResponse
from django.http import Http404
from django.template import Context, loader
from agendas.models import Agenda

def index(request):
    template = loader.get_template('agenda_detail.html')
    context = Context({'date': "April 5, 2011"})
    return HttpResponse(template.render(context))
    
def detail(request, agenda_id):
    try:
        agenda = Agenda.objects.get(pk=agenda_id)
    except Agenda.DoesNotExist:
        raise Http404
    template = loader.get_template('agenda_detail.html')
    context = Context({'agenda': agenda})
    return HttpResponse(template.render(context))
