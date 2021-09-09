import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateStub = z.object({
  id: z.number(),
  name: z.string(),
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
