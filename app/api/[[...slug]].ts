import { BlitzApiRequest, BlitzApiResponse, BlitzApiHandler } from "blitz"
import db, { prisma } from "db"

const dynamicHandler = async (method, slug) => {
  const project = await db.project.findFirst({ where: { basePath: `/${slug[0]}` } })
  if (!project) {
    return null
  }
  const path = slug.filter((_, i) => i !== 0).join("/")
  const stubs = await db.stub.findMany({ where: { projectId: project.id, path: `/${path}` } })

  return stubs.filter((stub) => stub.method === method)[0]
}

const Handler: BlitzApiHandler = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  const {
    query: { slug },
    method,
  } = req
  if (!Array.isArray(slug)) {
    return res.status(404).end()
  }
  const obj = await dynamicHandler(method, slug)
  if (!obj) {
    return res.status(404).end()
  }
  const { contentType, statusCode, response } = obj

  return res.status(Number(statusCode)).setHeader("Content-Type", contentType).end(response)
}

export default Handler
