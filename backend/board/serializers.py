from rest_framework import serializers
from .models import Board
from column.serializers import ColumnSerializer
class BoardSerializer(serializers.ModelSerializer):
    columns = ColumnSerializer(many=True, read_only=True)
    class Meta:
        model = Board
        fields = '__all__'
        read_only_fields = ['user']