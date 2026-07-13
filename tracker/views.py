from datetime import date as date_cls, timedelta

from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContextEvent, DayEntry, FinancialEntry, TaskCompletion, TaskDefinition
from .serializers import ContextEventSerializer, FinancialEntrySerializer, TaskDefinitionSerializer
from .services import compute_opening_balance, expand_financial_entries


def _parse_date(value):
    return date_cls.fromisoformat(value)


class TaskDefinitionViewSet(viewsets.ModelViewSet):
    serializer_class = TaskDefinitionSerializer

    def get_queryset(self):
        return TaskDefinition.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save(update_fields=['is_active'])
        return Response(status=status.HTTP_204_NO_CONTENT)


class ContextEventViewSet(viewsets.ModelViewSet):
    serializer_class = ContextEventSerializer

    def get_queryset(self):
        qs = ContextEvent.objects.filter(day__user=self.request.user).select_related('day')
        date_param = self.request.query_params.get('date')
        if date_param:
            qs = qs.filter(day__date=_parse_date(date_param))
        return qs

    def perform_create(self, serializer):
        date_param = self.request.data.get('date')
        if not date_param:
            raise ValueError('date is required')
        day, _ = DayEntry.objects.get_or_create(user=self.request.user, date=_parse_date(date_param))
        serializer.save(day=day)


class FinancialEntryViewSet(viewsets.ModelViewSet):
    serializer_class = FinancialEntrySerializer

    def get_queryset(self):
        qs = FinancialEntry.objects.filter(user=self.request.user)
        start = self.request.query_params.get('start')
        end = self.request.query_params.get('end')
        is_recurring = self.request.query_params.get('is_recurring')
        if start:
            qs = qs.filter(date__gte=_parse_date(start))
        if end:
            qs = qs.filter(date__lte=_parse_date(end))
        if is_recurring is not None:
            qs = qs.filter(is_recurring=is_recurring.lower() == 'true')
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DayDetailView(APIView):
    def get(self, request, date):
        day_date = _parse_date(date)
        day, _ = DayEntry.objects.get_or_create(user=request.user, date=day_date)

        completed_ids = set(
            TaskCompletion.objects.filter(day=day).values_list('task_definition_id', flat=True)
        )
        task_defs = TaskDefinition.objects.filter(user=request.user, is_active=True)
        task_completions = [
            {'task_definition_id': t.id, 'name': t.name, 'completed': t.id in completed_ids}
            for t in task_defs
        ]

        context_events = ContextEventSerializer(day.context_events.all(), many=True).data
        financial_entries = FinancialEntrySerializer(
            FinancialEntry.objects.filter(user=request.user, date=day_date, is_recurring=False), many=True
        ).data
        recurring_entries = FinancialEntrySerializer(
            FinancialEntry.objects.filter(user=request.user, is_recurring=True), many=True
        ).data

        return Response({
            'date': day_date.isoformat(),
            'journal_text': day.journal_text,
            'task_completions': task_completions,
            'context_events': context_events,
            'financial_entries': financial_entries,
            'recurring_entries': recurring_entries,
        })

    def patch(self, request, date):
        day_date = _parse_date(date)
        day, _ = DayEntry.objects.get_or_create(user=request.user, date=day_date)
        if 'journal_text' in request.data:
            day.journal_text = request.data['journal_text']
            day.save(update_fields=['journal_text'])
        return Response({'date': day_date.isoformat(), 'journal_text': day.journal_text})


class ToggleTaskView(APIView):
    def post(self, request, date):
        day_date = _parse_date(date)
        task_definition_id = request.data.get('task_definition_id')
        completed = request.data.get('completed')

        day, _ = DayEntry.objects.get_or_create(user=request.user, date=day_date)
        task_definition = get_object_or_404(TaskDefinition, id=task_definition_id, user=request.user)

        if completed:
            TaskCompletion.objects.get_or_create(day=day, task_definition=task_definition)
        else:
            TaskCompletion.objects.filter(day=day, task_definition=task_definition).delete()

        return Response({'task_definition_id': task_definition.id, 'completed': bool(completed)})


class IndicatorsSummaryView(APIView):
    def get(self, request):
        start = _parse_date(request.query_params['start'])
        end = _parse_date(request.query_params['end'])
        user = request.user

        days = DayEntry.objects.filter(user=user, date__range=(start, end)).prefetch_related(
            'task_completions', 'context_events'
        )
        days_by_date = {d.date: d for d in days}

        task_total_count = TaskDefinition.objects.filter(user=user, is_active=True).count()

        # financial_net per date
        net_by_date = {}
        for occ_date, amount in expand_financial_entries(user, start, end):
            net_by_date[occ_date] = net_by_date.get(occ_date, 0) + amount

        running_balance = compute_opening_balance(user, start)

        results = []
        current = start
        while current <= end:
            day = days_by_date.get(current)
            completed_count = len(day.task_completions.all()) if day else 0
            journal_text = day.journal_text if day else ''
            context_count = len(day.context_events.all()) if day else 0
            net = net_by_date.get(current, 0)
            running_balance += net

            results.append({
                'date': current.isoformat(),
                'task_completed_count': completed_count,
                'task_total_count': task_total_count,
                'task_completion_rate': (completed_count / task_total_count) if task_total_count else None,
                'journal_present': bool(journal_text),
                'journal_length': len(journal_text),
                'context_event_count': context_count,
                'financial_net': float(net),
                'financial_balance': float(running_balance),
            })
            current += timedelta(days=1)

        return Response(results)
