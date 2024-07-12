import { Router } from 'express'
import {
  createSession,
  destroySession,
  getProfile,
  refreshSession,
  registerUser,
  updateProfile,
  updateProfileImage
} from '../controllers/auth.controller'
import { requireUser } from '../middleware/auth'

export const authRouter: Router = Router()

authRouter.post('/register', registerUser)
authRouter.post('/login', createSession)
authRouter.post('/refreshToken', refreshSession)
authRouter.put('/logout', destroySession)
authRouter.get('/profile', requireUser, getProfile)
authRouter.put('/profile/update', requireUser, updateProfile)
authRouter.put('/profile/image', requireUser, updateProfileImage)
