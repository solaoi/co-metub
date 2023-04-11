import Database from "better-sqlite3"
import { join } from "path"

const database = process.env.DATABASE_URL
if (database === undefined) throw new Error()
const databasePath =
  process.env.NODE_ENV !== "production"
    ? join(process.cwd(), "db", database.replace("file:", ""))
    : database.replace("file:", "")

const db = new Database(databasePath, {
  fileMustExist: true,
  verbose: (o) => console.log("\u001b[32mbetter-sqlite3:query\x1b[39m " + o),
})

const getProjectIdByPreparedStatement = db.prepare("SELECT id FROM Project WHERE basePath = ?")
const getProjectIdBy = (basePath: string): number | null => {
  const row = getProjectIdByPreparedStatement.get(basePath)
  return row !== undefined ? row.id : null
}

type StubTableType = {
  id: number
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  path: string
  method: string
  contentType: string
  statusCode: string
  response: string
  cookies: string
  sleep: number
  logs: string
  ntimesError: number
  ntimesErrorStatusCode: string
  ntimesErrorCounter: number
  memo: string
  projectId: number
}

const getStubsByPreparedStatement = db.prepare(
  "SELECT * FROM Stub WHERE projectId = ? AND path = ?"
)
const getStubsBy = (projectId: number, path: string): StubTableType[] => {
  return getStubsByPreparedStatement.all(projectId, path)
}

const updateStubWithPreparedStatement = db.prepare(
  "UPDATE Stub SET logs = ?, ntimesErrorCounter = ? WHERE id = ?"
)
const updateStubBy = (id: number) => {
  const updateStubWith = (logs: string, ntimesErrorCounter: number) => {
    return new Promise((resolve) => {
      const info = updateStubWithPreparedStatement.run(logs, ntimesErrorCounter, id)
      resolve(info.changes)
    })
  }
  return { updateStubWith }
}

export { getProjectIdBy, getStubsBy, updateStubBy }
