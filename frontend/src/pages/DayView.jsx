import { useEffect, useState } from 'react'
import { ListChecks, BookOpen, Newspaper, Wallet } from 'lucide-react'
import { del, get, patch, post } from '../api/client'
import AgeTicker from '../components/AgeTicker'
import DateNavigator from '../components/DateNavigator'
import TaskChecklist from '../components/TaskChecklist'
import JournalEditor from '../components/JournalEditor'
import ContextEventsList from '../components/ContextEventsList'
import FinancialEntryList from '../components/FinancialEntryList'

function today() {
  return new Date().toISOString().slice(0, 10)
}

export default function DayView() {
  const [date, setDate] = useState(today())
  const [day, setDay] = useState(null)
  const [birthDatetime, setBirthDatetime] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    get('/auth/me/').then((me) => setBirthDatetime(me.birth_datetime))
  }, [])

  useEffect(() => {
    setLoading(true)
    get(`/days/${date}/`).then((data) => {
      setDay(data)
      setLoading(false)
    })
  }, [date])

  async function refresh() {
    const data = await get(`/days/${date}/`)
    setDay(data)
  }

  async function toggleTask(taskDefinitionId, completed) {
    setDay((d) => ({
      ...d,
      task_completions: d.task_completions.map((t) =>
        t.task_definition_id === taskDefinitionId ? { ...t, completed } : t
      ),
    }))
    await post(`/days/${date}/toggle-task/`, { task_definition_id: taskDefinitionId, completed })
  }

  async function saveJournal(text) {
    await patch(`/days/${date}/`, { journal_text: text })
    await refresh()
  }

  async function addContextEvent({ description, opinion }) {
    await post('/context-events/', { date, description, opinion })
    await refresh()
  }

  async function addFinancialEntry(payload) {
    await post('/financial-entries/', payload)
    await refresh()
  }

  async function deleteRecurringEntry(id) {
    await del(`/financial-entries/${id}/`)
    await refresh()
  }

  return (
    <div className="day-view">
      <AgeTicker birthDatetime={birthDatetime} />

      <DateNavigator date={date} onChange={setDate} />

      {loading || !day ? (
        <p className="loading-text">Loading…</p>
      ) : (
        <div className="day-sections">
          <section>
            <h2><ListChecks size={20} /> Habits &amp; tasks</h2>
            <TaskChecklist taskCompletions={day.task_completions} onToggle={toggleTask} />
          </section>

          <section>
            <h2><BookOpen size={20} /> Journal</h2>
            <JournalEditor text={day.journal_text} onSave={saveJournal} />
          </section>

          <section>
            <h2><Newspaper size={20} /> What was going on</h2>
            <ContextEventsList events={day.context_events} onAdd={addContextEvent} />
          </section>

          <section>
            <h2><Wallet size={20} /> Money</h2>
            <FinancialEntryList
              entries={day.financial_entries}
              recurringEntries={day.recurring_entries}
              date={date}
              onAdd={addFinancialEntry}
              onDeleteRecurring={deleteRecurringEntry}
            />
          </section>
        </div>
      )}
    </div>
  )
}
