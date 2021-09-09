import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateStub = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateStub), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const stub = await db.stub.create({ data: input })

  return stub
})
