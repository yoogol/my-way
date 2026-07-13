import { useEffect, useState } from 'react'

export const INDICATORS = [
  { key: 'task_completion_rate', label: 'Task completion rate', unit: 'rate', light: '#2a78d6', dark: '#3987e5' },
  { key: 'journal_length', label: 'Journal length', unit: 'chars', light: '#1baf7a', dark: '#199e70' },
  { key: 'context_event_count', label: 'Context events', unit: 'count', light: '#eda100', dark: '#c98500' },
  { key: 'financial_net', label: 'Financial net', unit: 'dollars', light: '#008300', dark: '#008300' },
  { key: 'financial_balance', label: 'Running balance', unit: 'dollars', light: '#4a3aa7', dark: '#9085e9' },
]

export function usePrefersDark() {
  const query = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null
  const [isDark, setIsDark] = useState(query ? query.matches : false)

  useEffect(() => {
    if (!query) return
    const listener = (e) => setIsDark(e.matches)
    query.addEventListener('change', listener)
    return () => query.removeEventListener('change', listener)
  }, [query])

  return isDark
}

export function seriesColor(indicator, isDark) {
  return isDark ? indicator.dark : indicator.light
}
