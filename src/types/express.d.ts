// express.d.ts
import { Request } from 'express'

declare global {
  namespace Express {
    interface Request {
      locals: any // Adjust the type as needed
    }
  }
}
