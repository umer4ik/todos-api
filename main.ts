import { Application, Router, Response } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts"
import  * as TodosAPI from './todos.ts'
import { Todo } from './todos.ts'

const handleError = (response: Response, error: Error) => {
  response.status = 404
  response.body = JSON.stringify({
    error: error.message
  })
}

const todosRouter = new Router({
  prefix: '/api/v1'
})
todosRouter
  .get(
    '/todos',
    (ctx) => {
      ctx.response.body = JSON.stringify(TodosAPI.getTodos())
    }
  )
  .get(
    '/todos/:id',
    (ctx) => {
      const { id } = ctx.params
      try {
        const todo = TodosAPI.getTodo(id)
        ctx.response.body = JSON.stringify(todo)
      } catch (error) {
        handleError(ctx.response, error)
      }
    }
  )
  .post(
    '/todos',
    async (ctx) => {
      try {
        const result = ctx.request.body({ type: 'json' })
        const todo: Pick<Todo, 'text'> = await result.value
        TodosAPI.addTodo(todo)
        ctx.response.body = JSON.stringify(todo)
      } catch (error) {
        handleError(ctx.response, error)
      }
    }
  )
  .put(
    '/todos/:id',
    async (ctx) => {
      const { id } = ctx.params
      try {
        const result = ctx.request.body({ type: 'json' })
        const todo: Pick<Todo, 'text' | 'completed'> = await result.value
        TodosAPI.updateTodo(id, todo)
        ctx.response.body = JSON.stringify(todo)
      } catch (error) {
        handleError(ctx.response, error)
      }
    }
  )
  .delete(
    '/todos/:id',
    (ctx) => {
      const { id } = ctx.params
      try {
        TodosAPI.deleteTodo(id)
        ctx.response.body = JSON.stringify({})
      } catch (error) {
        handleError(ctx.response, error)
      }
    }
  )
  .post(
    '/reset-todos',
    (ctx) => {
      TodosAPI.resetTodos()
      ctx.response.body = JSON.stringify({})
    }
  )

const helloRouter = new Router()
helloRouter.get('/', async (ctx) => {
  ctx.response.body = await Deno.readFile("./index.html")
})

const app = new Application()
app.use(oakCors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
app.use(helloRouter.routes())
app.use(todosRouter.routes())
app.listen({ port: 3001 })
