from django.db import models

class Agenda(models.Model):
    date = models.DateField()
    created_date = models.DateTimeField('date created')
    def __unicode__(self):
        return self.date
    
class Chunk(models.Model):
    agenda = models.ForeignKey(Agenda)
    time = models.TimeField()
    def __unicode__(self):
        return self.time
    
class Item(models.Model):
    chunk = models.ForeignKey(Chunk)
    duration = models.PositiveIntegerField('duration in minutes')
    name = models.CharField(max_length=255)
    fixed = models.BooleanField()
    time = models.TimeField('start time')
    def __unicode__(self):
        return self.time
