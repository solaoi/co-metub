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
    res.status(404).end()
    return
  }
  const obj = await dynamicHandler(method, slug)
  if (!obj) {
    res.status(404).end()
    return
  }
  const {
    id,
    contentType,
    statusCode,
    sleep,
    response,
    logs,
    ntimesError,
    ntimesErrorStatusCode,
    ntimesErrorCounter,
  } = obj

  const ntimesErrorCount = (() => {
    if (ntimesError === 0 || ntimesError === ntimesErrorCounter) {
      return 0
    } else {
      return ntimesErrorCounter + 1
    }
  })()

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

  const inNtimesErrorTerm = ntimesError > 0 && ntimesError >= ntimesErrorCounter + 1
  const sleepFunc = async () => {
    if (!inNtimesErrorTerm && sleep !== 0) {
      return snooze(sleep * 1000)
    }
  }

  await Promise.all([
    sleepFunc(),
    db.stub.update({
      where: { id },
      data: { logs: updatedLogs, ntimesErrorCounter: ntimesErrorCount },
    }),
  ])

  if (inNtimesErrorTerm) {
    res.status(Number(ntimesErrorStatusCode)).end()
    return
  }
  res.status(Number(statusCode)).setHeader("Content-Type", contentType).end(response)
}

export default Handler
