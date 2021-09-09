import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetStubsInput
  extends Pick<Prisma.StubFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetStubsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: stubs,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.stub.count({ where }),
      query: (paginateArgs) => db.stub.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      stubs,
      nextPage,
      hasMore,
      count,
    }
  }
)
