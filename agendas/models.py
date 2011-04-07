from django.db import models
from django.contrib.auth.models import User
import time, datetime

class Agenda(models.Model):
    user = models.ForeignKey(User)
    date = models.DateField()
    created_date = models.DateTimeField('date created')
    def __unicode__(self):
        return self.date.isoformat()
    
class Chunk(models.Model):
    agenda = models.ForeignKey(Agenda)
    time = models.TimeField()
    def __unicode__(self):
        return self.time.isoformat()
    
class Item(models.Model):
    chunk = models.ForeignKey(Chunk)
    duration = models.PositiveIntegerField('duration in minutes')
    name = models.CharField(max_length=255)
    fixed = models.BooleanField()
    time = models.TimeField('start time', blank=True, null=True)
    def __unicode__(self):
        return self.time.isoformat()
