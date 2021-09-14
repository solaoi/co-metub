import { z } from "zod"

const password = z.string().min(10).max(100)

export const Signup = z.object({
  name: z.string(),
  email: z.string().email(),
  password,
})

export const Login = z.object({
  email: z.string().email(),
  password: z.string(),
})
