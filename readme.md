# Simple Deno API

The API is developed for playing with different libraries and frameworks

To run locally:

* fetch the repo
* install [Deno](https://deno.land/#installation)
* run 
```bash
$ deno run --allow-net --allow-read --watch main.ts
```
* visit [`http://localhost:3001/`](`http://localhost:3001/`)

## The API

```typescript
type Todo: {
  id: string,
  text: string,
  completed: boolean
}
```
  

Methods:

*   **`GET`** /api/v1/todos`
    
    responses with `Todos[]`
    
*   **`POST`** /api/v1/todo`
    
    creates a `Todo`, accepts `{ text: string }` (`string` is not more than 255 chars long)
    
    responses with `Todo`
    
*   **`GET`** /api/v1/todo/:id`
    
    responses with `Todo`
    
*   **`PUT`** /api/v1/todo/:id`
    
    updates a `Todo`, accepts `{ text: string, completed: boolean }`, (`string` is not more than 255 chars long)
    
    reponses with `Todo`
    
*   **`DELETE`** /api/v1/todo/:id`
    
    deletes a `Todo`
    
*   **`POST`** /api/v1/reset-todos`
    
    resets all `Todo[]`