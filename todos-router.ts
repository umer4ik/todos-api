import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import * as TodosAPI from './todos.ts'
import { Todo } from './todos.ts'
import { handleError } from './errors.ts'

import { contentTypeMiddleware } from './middlewares/utils.ts'

export const todosRouter = new Router()

todosRouter
  .use(
    contentTypeMiddleware
  )
  .get(
    '/',
    (ctx) => {
      ctx.response.body = JSON.stringify(TodosAPI.getTodos())
    }
  )
  .get(
    '/:id',
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
    '/',
    async (ctx) => {
      try {
        const result = ctx.request.body({ type: 'json' })
        const todo: Pick<Todo, 'text'> = await result.value
        const resTodo = TodosAPI.addTodo(todo)
        ctx.response.body = JSON.stringify(resTodo)
      } catch (error) {
        handleError(ctx.response, error)
      }
    }
  )
  .put(
    '/:id',
    async (ctx) => {
      const { id } = ctx.params
      try {
        const result = ctx.request.body({ type: 'json' })
        const todo: Pick<Todo, 'text' | 'completed'> = await result.value
        const resTodo = TodosAPI.updateTodo(id, todo)
        ctx.response.body = JSON.stringify(resTodo)
      } catch (error) {
        handleError(ctx.response, error)
      }
    }
  )
  .delete(
    '/:id',
    (ctx) => {
      const { id } = ctx.params
      try {
        const todo = TodosAPI.deleteTodo(id)
        ctx.response.body = JSON.stringify(todo)
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