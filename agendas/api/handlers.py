from pprint import pprint
from piston.handler import BaseHandler
from agendas.models import Agenda
from piston.utils import rc

class AgendaHandler(BaseHandler):
    allowed_methods = ('GET', 'PUT', 'POST', 'DELETE')
    fields = ('id', 'date', 'start_time')
    model = Agenda

    def read(self, request, agenda_id=None, agenda_date=None):
        try:
            if agenda_id:
                return self.model.objects.get(pk=agenda_id)
            elif agenda_date:
                return self.model.objects.get(date=agenda_date)
            else:
                return self.model.objects.all()
        except self.model.DoesNotExist:
            return None
     
    def create(self, request, agenda_date=None):
        if request.content_type:
            data = request.data
            
            try:
                agenda = self.model.objects.get(date=data['date'])
            except (self.model.DoesNotExist):
                agenda = self.model(date=data['date'], start_time=data['start_time'])
                agenda.save()
            
            return agenda
        else:
            return None
     
    def update(self, request, agenda_id=None):
        if request.content_type:
            data = request.data
            
            try:
                agenda = self.model.objects.get(pk=agenda_id)
            except (self.model.DoesNotExist):
                return None
            
            agenda.date = data['date']
            agenda.start_time = data['start_time']
            agenda.save()
            
            return agenda
        else:
            return None
