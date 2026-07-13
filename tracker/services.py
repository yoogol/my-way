from datetime import timedelta

from dateutil.relativedelta import relativedelta
from django.db.models import Min, Q

from .models import FinancialEntry

_STEP = {
    'daily': relativedelta(days=1),
    'weekly': relativedelta(weeks=1),
    'monthly': relativedelta(months=1),
    'yearly': relativedelta(years=1),
}


def _expand_rule(entry, start_date, end_date):
    step = _STEP[entry.frequency]
    cursor = entry.date
    window_end = min(end_date, entry.end_date) if entry.end_date else end_date
    while cursor <= window_end:
        if cursor >= start_date:
            yield cursor, entry.amount
        cursor += step


def expand_financial_entries(user, start_date, end_date):
    """Yields (occurrence_date, amount) for every one-off and recurring entry in [start_date, end_date]."""
    one_off = FinancialEntry.objects.filter(user=user, is_recurring=False, date__range=(start_date, end_date))
    for e in one_off:
        yield e.date, e.amount

    recurring = FinancialEntry.objects.filter(user=user, is_recurring=True, date__lte=end_date).filter(
        Q(end_date__isnull=True) | Q(end_date__gte=start_date)
    )
    for e in recurring:
        yield from _expand_rule(e, start_date, end_date)


def compute_opening_balance(user, before_date):
    """Sum of every occurrence strictly before `before_date`, back to the user's earliest entry."""
    earliest = FinancialEntry.objects.filter(user=user).aggregate(Min('date'))['date__min']
    if earliest is None or earliest >= before_date:
        return 0
    window_end = before_date - timedelta(days=1)
    return sum(amount for _, amount in expand_financial_entries(user, earliest, window_end))
