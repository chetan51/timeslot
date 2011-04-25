from django.db import models
from django.contrib.auth.models import User
import time, datetime

class Agenda(models.Model):
    user = models.ForeignKey(User)
    date = models.DateField()
    start_time = models.TimeField('start time', blank=True, null=True)
    created = models.DateTimeField('created time', editable=False)
    updated = models.DateTimeField('updated time', editable=False)
    def __unicode__(self):
        return self.date.isoformat()
    def save(self, *args, **kwargs):
        if not self.id:
            self.created = datetime.datetime.today()
        if not self.start_time:
            self.start_time = "7:00"
        self.updated = datetime.datetime.today()
        super(Agenda, self).save(*args, **kwargs)
    
class Item(models.Model):
    START_RESTRICTON_TYPE_CHOICES = (
        ('fixed', 'fixed'),
        ('range', 'range'),
    )
    END_RESTRICTON_TYPE_CHOICES = (
        ('range', 'range'),
    )
    agenda = models.ForeignKey(Agenda)
    duration = models.PositiveIntegerField('duration in minutes')
    name = models.CharField(max_length=255, blank=True, null=True)
    start_restriction_type = models.CharField(max_length=5, choices=START_RESTRICTON_TYPE_CHOICES, blank=True, null=True)
    end_restriction_type = models.CharField(max_length=5, choices=END_RESTRICTON_TYPE_CHOICES, blank=True, null=True)
    start_restriction_time = models.TimeField('start time', blank=True, null=True)
    end_restriction_time = models.TimeField('end time', blank=True, null=True)
    def __unicode__(self):
        return self.name
