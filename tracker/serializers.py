from rest_framework import serializers

from .models import ContextEvent, FinancialEntry, TaskDefinition


class TaskDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskDefinition
        fields = ['id', 'name', 'is_active', 'order', 'created_at']
        read_only_fields = ['id', 'created_at']


class ContextEventSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()

    class Meta:
        model = ContextEvent
        fields = ['id', 'date', 'description', 'opinion', 'created_at']
        read_only_fields = ['id', 'date', 'created_at']

    def get_date(self, obj):
        return obj.day.date.isoformat()


class FinancialEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialEntry
        fields = ['id', 'description', 'amount', 'is_recurring', 'date', 'frequency', 'end_date', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate(self, data):
        is_recurring = data.get('is_recurring', getattr(self.instance, 'is_recurring', False))
        if is_recurring and not data.get('frequency', getattr(self.instance, 'frequency', None)):
            raise serializers.ValidationError('frequency is required for recurring entries.')
        return data
