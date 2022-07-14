import { BlitzApiRequest, BlitzApiResponse, BlitzApiHandler } from "blitz"
import { getProjectIdBy, getStubsBy, updateStubBy } from "../lib/sqlite3Client"

const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const dynamicHandler = (method, slug) => {
  const projectId = getProjectIdBy(`/${slug[0]}`)
  if (projectId === null) {
    return null
  }
  const path = slug.filter((_, i) => i !== 0).join("/")
  const stubs = getStubsBy(projectId, `/${path}`)
  return stubs.filter((stub) => stub.method === method)[0]
}

const Handler: BlitzApiHandler = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  res.shouldKeepAlive = false
  const {
    query: { slug },
    method,
  } = req
  if (!Array.isArray(slug)) {
    res.status(404).end()
    return
  }
  const obj = dynamicHandler(method, slug)
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
  const { updateStubWith } = updateStubBy(id)
  await Promise.all([sleepFunc(), updateStubWith(updatedLogs, ntimesErrorCount)])

  if (inNtimesErrorTerm) {
    res.status(Number(ntimesErrorStatusCode)).end()
    return
  }
  res.status(Number(statusCode)).setHeader("Content-Type", contentType).end(response)
}

export default Handler
