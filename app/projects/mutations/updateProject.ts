import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateProject = z.object({
  id: z.number(),
  name: z.string(),
  updatedBy: z.string(),
  basePath: z
    .string()
    .regex(/^\/[^\/]+$/, { message: "The only slash allowed is at the beginning of a basePath" }),
  memo: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateProject),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const project = await db.project.update({ where: { id }, data })

    return project
  }
)
