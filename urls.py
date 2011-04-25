from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import direct_to_template

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    (r'^$',        'timeslot.views.index'),
    (r'^agendas/', include('timeslot.agendas.urls')),
    
    (r'^accounts/', include('registration.urls')),
    (r'^$', direct_to_template,
            { 'template': 'index.html' }, 'index'),
    
    # Examples:
    # url(r'^$', 'timeslot.views.home', name='home'),
    # url(r'^timeslot/', include('timeslot.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
