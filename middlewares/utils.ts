import { RouterMiddleware } from "https://deno.land/x/oak@v10.6.0/mod.ts";

export const contentTypeMiddleware: RouterMiddleware<string> = async (ctx, next) => {
  ctx.response.headers.append('content-type', 'application/json')
  await next()
}
