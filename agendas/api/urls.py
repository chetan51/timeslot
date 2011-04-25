from django.conf.urls.defaults import patterns, include, url
from agendas.api.resources import CsrfExemptResource
from agendas.api.handlers import AgendaHandler

agenda_resource = CsrfExemptResource(AgendaHandler)

urlpatterns = patterns('',
    url(r'agenda/$', agenda_resource, {'emitter_format': 'json'}),
    url(r'agenda/date/(?P<agenda_date>[^/]+)', agenda_resource, {'emitter_format': 'json'}),
    url(r'agenda/date', agenda_resource, {'emitter_format': 'json'}),
    url(r'agenda/(?P<agenda_id>[^/]+)', agenda_resource, {'emitter_format': 'json'}),
)
