from django.db import models
from django.contrib.auth.models import User
import time, datetime

class Agenda(models.Model):
    #user = models.ForeignKey(User)
    date = models.DateField()
    start_time = models.TimeField('start time', blank=True, null=True)
    created = models.DateTimeField('created time', editable=False)
    updated = models.DateTimeField('updated time', editable=False)
    def __unicode__(self):
        return self.date.isoformat()
    def save(self):
        if not self.id:
            self.created = datetime.datetime.today()
        self.updated = datetime.datetime.today()
        super(Agenda, self).save()
    
class Item(models.Model):
    agenda = models.ForeignKey(Agenda)
    duration = models.PositiveIntegerField('duration in minutes')
    name = models.CharField(max_length=255)
    start_time = models.TimeField('start time', blank=True, null=True)
    end_time = models.TimeField('end time', blank=True, null=True)
    def __unicode__(self):
        return self.name
