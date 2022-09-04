import { create, verify, getNumericDate } from "https://deno.land/x/djwt@v2.7/mod.ts";

const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"]
)

export const login = async (email: string, password: string) => {
  if (email === 'user@todos.api' && password === 'superpass') {
    const token = await create(
      { alg: "HS512", typ: "JWT" },
      { email, exp: getNumericDate(60 * 60) },
      key
    )
    return {
      token
    }
  }
  throw new Error('Invalid credentials')
}

export const verifyToken = (token: string) => verify(token, key)
