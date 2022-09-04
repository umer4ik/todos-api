import { Response } from "https://deno.land/x/oak@v10.6.0/mod.ts";
export const handleError = (response: Response, error: Error, status = 404) => {
  response.status = status
  response.headers.append('content-type', 'application/json')
  response.body = JSON.stringify({
    error: error.message
  })
}
