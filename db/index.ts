import { enhancePrisma } from "blitz"
import { PrismaClient } from "@prisma/client"

const EnhancedPrisma = enhancePrisma(PrismaClient)

export * from "@prisma/client"
// eslint-disable-next-line import/no-anonymous-default-export
export default new EnhancedPrisma({ log: ["query", "warn", "error"] })
