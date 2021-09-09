import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetStub = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetStub), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const stub = await db.stub.findFirst({ where: { id } })

  if (!stub) throw new NotFoundError()

  return stub
})
