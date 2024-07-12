/* eslint-disable @typescript-eslint/space-before-function-paren */
import { PrismaClient, Prisma } from '@prisma/client'
import { logger } from './logger'

class ExtendedPrismaClient extends PrismaClient {
  constructor() {
    super()
    this.$on('beforeExit' as never, async () => {
      logger.info('Prisma Client is disconnecting')
    })
  }

  async connect() {
    await this.$connect()
    logger.info('Prisma Client is connected')
  }
}

const prisma = new ExtendedPrismaClient()

export const handlePrismaError = (error: any) => {
  console.log(error)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // The .code property can be accessed in a PrismaClientKnownRequestError
    switch (error.code) {
      case 'P2002':
        return 'Unique constraint failed'
      case 'P2003':
        return 'Foreign key constraint failed'
      case 'P2025':
        return 'Record not found'
      default:
        return `Prisma error: ${error.message}`
    }
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return `Unknown error: ${error.message}`
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    return `Rust panic: ${error.message}`
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    return `Initialization error: ${error.message}`
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    return `Validation error: ${error.message}`
  } else {
    return `Unexpected error: ${error.message}`
  }
}

export default prisma
