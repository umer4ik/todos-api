export type Todo = {
  id: string,
  text: string,
  completed: boolean
}
export const defaultTodos: Todo[] = [
  {
    id: '1',
    text: "Learn TypeScript",
    completed: true
  },
  {
    id: '2',
    text: "Learn React",
    completed: true
  },
  {
    id: '3',
    text: "Learn Deno",
    completed: false
  },
  {
    id: '4',
    text: "Learn React Query",
    completed: false
  }
]

let todos: Todo[] = []

export const resetTodos = () => {
  todos = [...defaultTodos]
}
resetTodos()

export const getTodos = () => todos

const limitText = (text: string) => text.substring(0, 255)

export const addTodo = (todo: Pick<Todo, 'text'>) => {
  const id = String(todos.length + 1)
  if (todos.length === 1000) {
    resetTodos()
  }
  todos.push({
    ...todo,
    id,
    completed: false
  })
}

export const getTodo = (id: string) => {
  const todo = todos.find(todo => todo.id === id)
  if (todo) {
    return todo
  } else {
    throw new Error(`Todo with id ${id} not found`)
  }
}

export const updateTodo = (id: string, todo: Pick<Todo, 'text' | 'completed'>) => {
  const index = todos.findIndex(t => t.id === id)
  if (index > -1) {
    todos[index] = {
      ...todo,
      text: limitText(todo.text),
      id
    }
  } else {
    throw new Error(`Todo with id ${id} not found`)
  }
}

export const deleteTodo = (id: string) => {
  const index = todos.findIndex(t => t.id === id)
  if (index > -1) {
    todos.splice(index, 1)
  } else {
    throw new Error(`Todo with id ${id} not found`)
  }
}

