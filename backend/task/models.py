from django.db import models
from column.models import Column
# Create your models here.

class Task(models.Model):
    column = models.ForeignKey(Column, on_delete=models.CASCADE, related_name="task")
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=100)
    position = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title