from piston.handler import BaseHandler
from agendas.models import Agenda, Item
from piston.utils import rc

class AgendaHandler(BaseHandler):
    allowed_methods = ('GET', 'PUT', 'POST', 'DELETE')
    fields = ('id', 'date', 'start_time')
    model = Agenda

    def read(self, request, agenda_id=None, agenda_date=None):
        if not request.user.is_authenticated():
            return rc.FORBIDDEN
        try:
            if agenda_id:
                agenda = self.model.objects.get(user=request.user, pk=agenda_id)
            elif agenda_date:
                agenda = self.model.objects.get(user=request.user, date=agenda_date)
            else:
                return self.model.objects.filter(user=request.user)
            return agenda
        except self.model.DoesNotExist:
            return None
     
    def create(self, request, agenda_date=None):
        if not request.user.is_authenticated():
            return rc.FORBIDDEN
        if request.content_type:
            data = request.data
            
            agenda, create = self.model.objects.get_or_create(user=request.user, date=data.get('date'), defaults={'start_time': data.get('start_time')})
            
            return agenda
        else:
            return None
     
    def update(self, request, agenda_id=None):
        if not request.user.is_authenticated():
            return rc.FORBIDDEN
        if request.content_type:
            data = request.data
            
            try:
                agenda = self.model.objects.get(user=request.user, pk=agenda_id)
            except (self.model.DoesNotExist):
                return None
            
            agenda.date = data.get('date')
            agenda.start_time = data.get('start_time')
            agenda.save()
            
            return agenda
        else:
            return None
 
class ItemHandler(BaseHandler):
    allowed_methods = ('GET', 'PUT', 'POST', 'DELETE')
    fields = (('item', ('id')), 'id', 'duration', 'name',  'start_restriction_type', 'start_restriction_time', 'end_restriction_type', 'end_restriction_time')
    model = Item

    def read(self, request, item_id=None, item_date=None):
        if not request.user.is_authenticated():
            return rc.FORBIDDEN
        try:
            if item_id:
                return self.model.objects.get(pk=item_id)
            elif item_date:
                agenda = Agenda.objects.get(user=request.user, date=item_date)
                return self.model.objects.filter(agenda=agenda)
            else:
                return self.model.objects.all()
        except (self.model.DoesNotExist, Agenda.DoesNotExist):
            return None
     
    def create(self, request, item_date=None):
        if not request.user.is_authenticated():
            return rc.FORBIDDEN
        if item_date and request.content_type:
            data = request.data
            
            agenda, create = Agenda.objects.get_or_create(user=request.user, date=item_date)
            
            item = self.model(
                    agenda=agenda,
                    duration=data.get('duration'),
                    name=data.get('name'),
                    start_restriction_type=data.get('start_restriction_type'),
                    start_restriction_time=data.get('start_restriction_time'),
                    end_restriction_type=data.get('end_restriction_type'),
                    end_restriction_time=data.get('end_restriction_time')
            )
            item.save()
        
            return item
        else:
            return None
     
    def update(self, request, item_id=None):
        if not request.user.is_authenticated():
            return rc.FORBIDDEN
        if request.content_type:
            data = request.data
            
            try:
                item = self.model.objects.get(pk=item_id)
            except (self.model.DoesNotExist):
                return None
            
            item.duration = data.get('duration')
            item.name = data.get('name')
            item.start_restriction_type = data.get('start_restriction_type')
            item.end_restriction_type = data.get('end_restriction_type')
            item.start_restriction_time = data.get('start_restriction_time')
            item.end_restriction_time = data.get('end_restriction_time')
            item.save()
            
            return item
        else:
            return None
     
    def delete(self, request, item_id=None):
        if not request.user.is_authenticated():
            return rc.FORBIDDEN
        try:
            item = self.model.objects.get(pk=item_id)
        except (self.model.DoesNotExist):
            return None
        
        item.delete()
        return rc.DELETED
