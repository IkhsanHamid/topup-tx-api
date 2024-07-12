import { type Request, type Response, type NextFunction } from 'express'
import { findAccessToken } from '../services/auth.service'

export const requireUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.locals
  if (!user) {
    return res.status(403).json({ message: 'Unauthorized' })
  }
  const checkDB = await findAccessToken(user.id)
  if (!checkDB) {
    return res.status(403).json({ message: 'Unauthorized' })
  }

  return next()
}
