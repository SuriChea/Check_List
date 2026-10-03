import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { Check, CheckCheck, Circle, ListTodo, Pencil, Plus, Save, SquareCheck, Trash2, X } from 'lucide-react'
import { todosApi } from '../api/todos'
import type { Todo } from '../api/todos'
import '../todo.css'

type Filter = 'all' | 'active' | 'completed'

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'active', label: 'กำลังทำ' },
  { id: 'completed', label: 'เสร็จแล้ว' },
]

function formatDate(value: string) {
  return new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short' }).format(new Date(value))
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [draft, setDraft] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDraft, setEditDraft] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    todosApi.list()
      .then(setTodos)
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'โหลดรายการไม่สำเร็จ'))
      .finally(() => setIsLoading(false))
  }, [])

  const activeCount = todos.filter((todo) => !todo.isCompleted).length
  const completedCount = todos.length - activeCount
  const completion = todos.length ? Math.round((completedCount / todos.length) * 100) : 0
  const visibleTodos = useMemo(() => todos.filter((todo) => {
    if (filter === 'active') return !todo.isCompleted
    if (filter === 'completed') return todo.isCompleted
    return true
  }), [filter, todos])
  const today = new Intl.DateTimeFormat('th-TH', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())

  async function addTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = draft.trim()
    if (!title || isSaving) return

    setIsSaving(true)
    setError('')
    try {
      const todo = await todosApi.create(title)
      setTodos((current) => [todo, ...current])
      setDraft('')
      setFilter('all')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'เพิ่มรายการไม่สำเร็จ')
    } finally {
      setIsSaving(false)
    }
  }

  async function toggleTodo(todo: Todo) {
    setError('')
    try {
      const updated = await todosApi.update(todo.id, { title: todo.title, isCompleted: !todo.isCompleted })
      setTodos((current) => current.map((item) => item.id === updated.id ? updated : item))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'ปรับสถานะไม่สำเร็จ')
    }
  }

  async function saveEdit(todo: Todo) {
    const title = editDraft.trim()
    if (!title) return
    setError('')
    try {
      const updated = await todosApi.update(todo.id, { title, isCompleted: todo.isCompleted })
      setTodos((current) => current.map((item) => item.id === updated.id ? updated : item))
      setEditingId(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'แก้ไขรายการไม่สำเร็จ')
    }
  }

  async function deleteTodo(id: number) {
    setError('')
    try {
      await todosApi.remove(id)
      setTodos((current) => current.filter((todo) => todo.id !== id))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'ลบรายการไม่สำเร็จ')
    }
  }

  return (
    <div className="todo-app">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Check size={19} strokeWidth={3} /></span> วันต่อวัน</div>
        <p className="side-label">พื้นที่ของฉัน</p>
        <nav className="nav-list" aria-label="ตัวกรองรายการ">
          <button className="nav-item" aria-current={filter === 'all' ? 'page' : undefined} onClick={() => setFilter('all')}>
            <ListTodo className="nav-icon" size={18} /> รายการทั้งหมด <span className="nav-count">{todos.length}</span>
          </button>
          <button className="nav-item" aria-current={filter === 'active' ? 'page' : undefined} onClick={() => setFilter('active')}>
            <Circle className="nav-icon" size={17} /> กำลังทำ <span className="nav-count">{activeCount}</span>
          </button>
          <button className="nav-item" aria-current={filter === 'completed' ? 'page' : undefined} onClick={() => setFilter('completed')}>
            <CheckCheck className="nav-icon" size={18} /> เสร็จแล้ว <span className="nav-count">{completedCount}</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <p className="side-label">วันนี้</p>
          <p className="sidebar-date">{today}</p>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topline">
          <span className="eyebrow">บันทึกประจำวัน</span>
          <span className="connection-state"><span className="connection-dot" /> {todosApi.isMock ? 'โหมดทดลอง' : 'ซิงก์กับฐานข้อมูล'}</span>
        </header>

        <section className="page-heading">
          <div>
            <p className="eyebrow">ทีละอย่างก็พอ</p>
            <h1>จัดวันให้ลงตัว</h1>
          </div>
          <div className="progress-note">
            <div className="progress-ring" style={{ '--progress': `${completion}%` } as CSSProperties}>
              <span>{completion}%</span>
            </div>
            <span>วันนี้ทำแล้ว<br /><strong>{completedCount} จาก {todos.length}</strong></span>
          </div>
        </section>

        <form className="composer" onSubmit={addTodo}>
          <Plus size={20} color="#67806f" aria-hidden="true" />
          <input
            aria-label="เพิ่มรายการใหม่"
            placeholder="มีอะไรที่อยากทำให้เสร็จ?"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={180}
          />
          <button className="primary-button" disabled={isSaving || !draft.trim()} type="submit">
            <Plus size={16} /> เพิ่มรายการ
          </button>
        </form>

        {error && <div className="error-banner" role="alert">{error}<button type="button" aria-label="ปิดข้อความ" onClick={() => setError('')}><X size={16} /></button></div>}

        <section aria-labelledby="list-heading">
          <div className="list-toolbar">
            <h2 id="list-heading">รายการของฉัน <span className="nav-count">({visibleTodos.length})</span></h2>
            <div className="filter-tabs" role="group" aria-label="กรองรายการ">
              {filters.map((item) => (
                <button key={item.id} className="filter-tab" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)} type="button">
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? <div className="loading-state">กำลังโหลดรายการ...</div> : visibleTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{filter === 'completed' ? <SquareCheck size={21} /> : <Circle size={20} />}</div>
              <strong>{filter === 'completed' ? 'ยังไม่มีรายการที่เสร็จ' : filter === 'active' ? 'ไม่มีงานค้างแล้ว' : 'เริ่มต้นวันด้วยรายการแรก'}</strong>
              <span>{filter === 'all' ? 'เพิ่มสิ่งที่อยากทำ แล้วค่อยๆ ทำทีละอย่าง' : 'ลองเลือกดูรายการในตัวกรองอื่น'}</span>
            </div>
          ) : (
            <div className="task-list">
              {visibleTodos.map((todo) => (
                <article className="task-row" key={todo.id}>
                  <button className="task-check" aria-label={todo.isCompleted ? `ทำ ${todo.title} เป็นงานค้าง` : `ทำ ${todo.title} ให้เสร็จ`} aria-pressed={todo.isCompleted} onClick={() => void toggleTodo(todo)} type="button">
                    {todo.isCompleted && <Check size={14} strokeWidth={2.7} />}
                  </button>
                  {editingId === todo.id ? (
                    <input
                      className="task-edit-input"
                      aria-label="แก้ไขชื่อรายการ"
                      autoFocus
                      value={editDraft}
                      maxLength={180}
                      onChange={(event) => setEditDraft(event.target.value)}
                      onKeyDown={(event) => { if (event.key === 'Enter') void saveEdit(todo); if (event.key === 'Escape') setEditingId(null) }}
                    />
                  ) : (
                    <span className={`task-title${todo.isCompleted ? ' is-complete' : ''}`}>{todo.title}</span>
                  )}
                  <div className="task-meta">
                    <time className="task-date" dateTime={todo.createdAt}>{formatDate(todo.createdAt)}</time>
                    <div className="task-actions">
                      {editingId === todo.id ? (
                        <>
                          <button className="icon-button" aria-label="บันทึกการแก้ไข" onClick={() => void saveEdit(todo)} type="button"><Save size={16} /></button>
                          <button className="icon-button" aria-label="ยกเลิกการแก้ไข" onClick={() => setEditingId(null)} type="button"><X size={16} /></button>
                        </>
                      ) : (
                        <>
                          <button className="icon-button" aria-label={`แก้ไข ${todo.title}`} onClick={() => { setEditingId(todo.id); setEditDraft(todo.title) }} type="button"><Pencil size={15} /></button>
                          <button className="icon-button danger" aria-label={`ลบ ${todo.title}`} onClick={() => void deleteTodo(todo.id)} type="button"><Trash2 size={15} /></button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}