from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    ContextEventViewSet,
    DayDetailView,
    FinancialEntryViewSet,
    IndicatorsSummaryView,
    TaskDefinitionViewSet,
    ToggleTaskView,
)

router = DefaultRouter()
router.register('task-definitions', TaskDefinitionViewSet, basename='task-definition')
router.register('context-events', ContextEventViewSet, basename='context-event')
router.register('financial-entries', FinancialEntryViewSet, basename='financial-entry')

urlpatterns = [
    path('days/<str:date>/', DayDetailView.as_view()),
    path('days/<str:date>/toggle-task/', ToggleTaskView.as_view()),
    path('indicators/summary/', IndicatorsSummaryView.as_view()),
] + router.urls
