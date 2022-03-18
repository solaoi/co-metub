import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateStub = z.object({
  id: z.number(),
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
  response: z.string(),
  sleep: z.number().min(0),
  ntimesError: z.number().min(0).default(0),
  ntimesErrorStatusCode: z
    .string()
    .regex(/^\d{3}$/, { message: "The ntimes error status code must be a three-digit number." }),
  memo: z.string().default(""),
})

export default resolver.pipe(
  resolver.zod(UpdateStub),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const stub = await db.stub.update({ where: { id }, data })

    return stub
  }
)
