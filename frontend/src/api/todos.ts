export type Todo = {
  id: number
  title: string
  isCompleted: boolean
  createdAt: string
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'
const MOCK_STORAGE_KEY = 'todo-list.mock-data.v1'

const mockTodos: Todo[] = [
  { id: 1, title: 'วางแผนงานสำคัญประจำสัปดาห์ (ข้อมูลจาก mock data)', isCompleted: true, createdAt: '2026-10-03T08:00:00.000Z' },
  { id: 2, title: 'เตรียมเอกสารสำหรับประชุมทีม (ข้อมูลจาก mock data)', isCompleted: false, createdAt: '2026-10-03T07:30:00.000Z' },
  { id: 3, title: 'ตอบอีเมลที่ค้างไว้ (ข้อมูลจาก mock data)', isCompleted: false, createdAt: '2026-10-02T09:15:00.000Z' },
  { id: 4, title: 'จัดโต๊ะทำงานให้เรียบร้อย (ข้อมูลจาก mock data)', isCompleted: true, createdAt: '2026-10-02T06:45:00.000Z' },
  { id: 5, title: 'ทบทวนรายการงานก่อนเลิกงาน (ข้อมูลจาก mock data)', isCompleted: false, createdAt: '2026-10-01T10:20:00.000Z' },
]

function readMockTodos(): Todo[] {
  const saved = localStorage.getItem(MOCK_STORAGE_KEY)
  if (saved) return JSON.parse(saved) as Todo[]
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockTodos))
  return mockTodos
}

function writeMockTodos(todos: Todo[]) {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(todos))
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(payload?.message ?? `Request failed (${response.status})`)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const todosApi = {
  isMock: USE_MOCK_API,
  list: () => USE_MOCK_API ? Promise.resolve(readMockTodos()) : request<Todo[]>('/todos'),
  create: (title: string) => USE_MOCK_API
    ? Promise.resolve().then(() => {
      const todos = readMockTodos()
      const todo = { id: Math.max(0, ...todos.map((item) => item.id)) + 1, title, isCompleted: false, createdAt: new Date().toISOString() }
      writeMockTodos([todo, ...todos])
      return todo
    })
    : request<Todo>('/todos', {
    method: 'POST',
    body: JSON.stringify({ title }),
  }),
  update: (id: number, changes: Pick<Todo, 'title' | 'isCompleted'>) => USE_MOCK_API
    ? Promise.resolve().then(() => {
      const todos = readMockTodos()
      const todo = todos.find((item) => item.id === id)
      if (!todo) throw new Error('Todo not found')
      const updated = { ...todo, ...changes }
      writeMockTodos(todos.map((item) => item.id === id ? updated : item))
      return updated
    })
    : request<Todo>(`/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(changes),
  }),
  remove: (id: number) => USE_MOCK_API
    ? Promise.resolve().then(() => {
      writeMockTodos(readMockTodos().filter((todo) => todo.id !== id))
    })
    : request<void>(`/todos/${id}`, { method: 'DELETE' }),
}