from .models import Column
from .serializers import ColumnSerializer
from rest_framework import viewsets
# Create your views here.

class ColumnViewSet(viewsets.ModelViewSet):
    serializer_class = ColumnSerializer
    queryset = Column.objects.all()

    def get_queryset(self):
        return Column.objects.filter(board=self.request.board)
    
    def perform_create(self, serializer):
        serializer.save(board=self.request.board)
