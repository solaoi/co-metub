import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteStub = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteStub), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const stub = await db.stub.deleteMany({ where: { id } })

  return stub
})
