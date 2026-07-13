from django.conf import settings
from django.db import models


class TaskDefinition(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='task_definitions')
    name = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [('user', 'name')]
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class DayEntry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='days')
    date = models.DateField()
    journal_text = models.TextField(blank=True)

    class Meta:
        unique_together = [('user', 'date')]
        ordering = ['date']

    def __str__(self):
        return f'{self.user_id} — {self.date}'


class TaskCompletion(models.Model):
    day = models.ForeignKey(DayEntry, on_delete=models.CASCADE, related_name='task_completions')
    task_definition = models.ForeignKey(TaskDefinition, on_delete=models.CASCADE, related_name='completions')

    class Meta:
        unique_together = [('day', 'task_definition')]


class ContextEvent(models.Model):
    day = models.ForeignKey(DayEntry, on_delete=models.CASCADE, related_name='context_events')
    description = models.TextField()
    opinion = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']


class FinancialEntry(models.Model):
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='financial_entries')
    description = models.CharField(max_length=300, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    is_recurring = models.BooleanField(default=False)
    date = models.DateField()
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES, null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f'{self.description or "entry"}: {self.amount}'
