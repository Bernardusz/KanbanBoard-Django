from rest_framework import viewsets
from .serializers import TaskSerializer
from .models import Task
# Create your views here.

class TaskViewset(viewsets.ModelViewSet):
    serializer_class = Task
    queryset = Task.objects.all()

    def get_queryset(self):
        return Task.objects.filter(column=self.request.column)
    
    def perform_create(self, serializer):
        serializer.save(column=self.request.column)
