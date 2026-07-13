from django.contrib import admin

from .models import ContextEvent, DayEntry, FinancialEntry, TaskCompletion, TaskDefinition

admin.site.register(TaskDefinition)
admin.site.register(DayEntry)
admin.site.register(TaskCompletion)
admin.site.register(ContextEvent)
admin.site.register(FinancialEntry)
