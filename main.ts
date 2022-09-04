import { Application, Router, Response, RouterMiddleware } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts"
import * as TodosAPI from './todos.ts'
import * as AuthAPI from './auth.ts'
import { Todo } from './todos.ts'
import { handleError } from './errors.ts'
import { todosRouter } from './todos-router.ts'
import { contentTypeMiddleware } from './middlewares/utils.ts'

const authMiddleware: RouterMiddleware<string> = async (ctx, next) => {
  const authorization = ctx.request.headers.get('authorization')
  if (authorization) {
    const token = authorization.split(' ')[1]
    try {
      await AuthAPI.verifyToken(token)
      await next()
    } catch (error) {
      handleError(ctx.response, error, 401)
    }
  } else {
    handleError(ctx.response, new Error('Missing authorization header'), 401)
  }
}

const todosApiPublicRouter = new Router({
  prefix: '/api/v1/todos'
}).use(todosRouter.routes())

const todosApiProtectedRouter = new Router({
  prefix: '/api/v1/protected/todos'
}).use(authMiddleware, todosRouter.routes())


const authRouter = new Router({
  prefix: '/api/v1/auth'
})
  .use(
    contentTypeMiddleware
  )
  .post('/login', async ctx => {
    try {
      const result = ctx.request.body({ type: 'json' })
      const { email, password } = await result.value
      const response = await AuthAPI.login(email, password)
      ctx.response.body = JSON.stringify(response)
    } catch (error) {
      handleError(ctx.response, error, 401)
    }
  })

const helloRouter = new Router()
helloRouter
  .get('/', async (ctx) => {
    ctx.response.body = await Deno.readFile("./index.html")
  })

const app = new Application()
app.use(oakCors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
app
  .use(helloRouter.routes())
  .use(authRouter.routes())
  .use(todosApiPublicRouter.routes())
  .use(todosApiProtectedRouter.routes())

app.use(ctx => {
  ctx.response.status = 404
  ctx.response.headers.append('content-type', 'application/json')
  ctx.response.body = JSON.stringify({ error: 'Not found' })
})
app.listen({ port: 3001 })
