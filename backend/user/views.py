from .serializers import UserSerializer
from rest_framework import generics
from django.contrib.auth.models import User
# Create your views here.

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class= UserSerializer