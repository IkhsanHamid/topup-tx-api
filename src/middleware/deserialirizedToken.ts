/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { type Request, type Response, type NextFunction } from 'express'
import { verifyJWT } from '../config/jwt'

const deserializedToken = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.replace(/^Bearer\s/, '')
  if (!accessToken) {
    return next()
  }
  const { decoded, expired } = verifyJWT(accessToken) as any
  if (decoded) {
    res.locals.user = decoded
    req.locals = decoded
    return next()
  }

  if (expired) {
    return next()
  }

  return next()
}

export default deserializedToken
