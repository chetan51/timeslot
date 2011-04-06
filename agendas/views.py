from django.http import HttpResponse
from django.template import Context, loader

def index(request):
    template = loader.get_template('agenda_detail.html')
    context = Context({'date': "April 5, 2011"})
    return HttpResponse(template.render(context))
