from .models import Board
from .serializers import BoardSerializer
from rest_framework import viewsets, permissions
# Create your views here.

class BoardViewSet(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Board.objects.all()

    def get_queryset(self):
        return Board.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
