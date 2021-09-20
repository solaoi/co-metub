import { BlitzApiRequest, BlitzApiResponse, BlitzApiHandler } from "blitz"
import db, { prisma } from "db"

const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

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
  const { id, contentType, statusCode, sleep, response, logs } = obj
  if (sleep !== 0) {
    await snooze(sleep * 1000)
  }

  const RECENT_LOGS = 3
  const { slug: _, ...query } = req.query
  const body = (() => {
    const bodies = Object.keys(Object.assign({}, req.body))
    return bodies
      .map((b) => {
        try {
          return JSON.stringify(JSON.parse(b))
        } catch {
          return b
        }
      })
      .join(",")
  })()
  const log = `date: ${new Date().toLocaleString()}\nquery: ${JSON.stringify(
    query,
    null,
    2
  )}\nbody: ${body}\nheaders: ${JSON.stringify(req.headers, null, 2)}`
  const logArr = logs.split("\t")
  const updatedLogs = [
    log,
    ...logArr.filter((_, i) => logArr.length < RECENT_LOGS || i !== logArr.length - 1),
  ].join("\t")
  await db.stub.update({ where: { id }, data: { logs: updatedLogs } })

  return res.status(Number(statusCode)).setHeader("Content-Type", contentType).end(response)
}

export default Handler
