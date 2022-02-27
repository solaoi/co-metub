import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateStub = z.object({
  createdBy: z.string(),
  updatedBy: z.string(),
  path: z.string().regex(/^\/.*[^\/]$/, {
    message: "Slashes are only allowed at the beginning of a path and in the middle of a path.",
  }),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]),
  contentType: z.enum([
    "application/json",
    "application/xml",
    "text/plain",
    "text/json",
    "text/html",
    "text/javascript",
    "text/css",
    "text/csv",
    "text/tab-separated-values",
  ]),
  statusCode: z
    .string()
    .regex(/^\d{3}$/, { message: "The status code must be a three-digit number." }),
  response: z.string().default(""),
  sleep: z.number().min(0).default(0),
  ntimesError: z.number().min(0).default(0),
  ntimesErrorStatusCode: z
    .string()
    .regex(/^\d{3}$/, { message: "The ntimes error status code must be a three-digit number." }),
  ntimesErrorCounter: z.number().min(0).default(0),
  logs: z.string().default(""),
  projectId: z.number(),
  memo: z.string().default(""),
})

export default resolver.pipe(resolver.zod(CreateStub), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const stub = await db.stub.create({ data: input })

  return stub
})
