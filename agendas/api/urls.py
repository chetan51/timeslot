from django.conf.urls.defaults import patterns, include, url
from agendas.api.resources import CsrfExemptResource
from agendas.api.handlers import AgendaHandler, ItemHandler

agenda_resource = CsrfExemptResource(AgendaHandler)
item_resource = CsrfExemptResource(ItemHandler)

urlpatterns = patterns('',
    url(r'agenda/$', agenda_resource, {'emitter_format': 'json'}),
    url(r'agenda/date/(?P<agenda_date>[^/]+)', agenda_resource, {'emitter_format': 'json'}),
    url(r'agenda/date', agenda_resource, {'emitter_format': 'json'}),
    url(r'agenda/(?P<agenda_id>[^/]+)', agenda_resource, {'emitter_format': 'json'}),
    
    url(r'item/$', item_resource, {'emitter_format': 'json'}),
    url(r'item/date/(?P<item_date>[^/]+)', item_resource, {'emitter_format': 'json'}),
    url(r'item/date', item_resource, {'emitter_format': 'json'}),
    url(r'item/(?P<item_id>[^/]+)', item_resource, {'emitter_format': 'json'}),
)
