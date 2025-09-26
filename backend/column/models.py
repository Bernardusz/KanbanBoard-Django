from django.db import models
from board.models import Board
# Create your models here.

class Column(models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name="columns")
    title = models.CharField(max_length=100)
    position = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.board.title} - {self.title}"