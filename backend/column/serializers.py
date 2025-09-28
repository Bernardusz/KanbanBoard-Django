from rest_framework import serializers
from .models import Column
from task.serializers import TaskSerializer

class ColumnSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    class Meta:
        model = Column
        fields = '__all__'
