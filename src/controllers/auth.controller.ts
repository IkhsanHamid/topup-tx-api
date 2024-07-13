import { type Request, type Response } from 'express'
import {
  createAuth,
  createUser,
  destroyAuth,
  findUserbyEmail,
  updateAccessToken,
  updateName,
  updateProfileImageService
} from '../services/auth.service'
import {
  createUserValidation,
  destroySessionValidation,
  loginValidation,
  refreshSessionValidation,
  updateProfileValidation
} from '../validations/auth.validation'
import { logger } from '../config/logger'
import { checkPassword, hashing } from '../config/hashing'
import { reIssueAccessToken, signJWT } from '../config/jwt'
import upload from '../middleware/multer'

// register
export const registerUser = async (req: Request, res: Response) => {
  // START: validation payload
  const { error, value } = createUserValidation(req.body)
  if (error) {
    logger.error('ERR: auth - register = ', error.details[0].message)
    return res.send({ status: 102, message: error.details[0].message, data: null })
  }
  // END: validation payload
  try {
    // hashing password
    value.password = `${hashing(value.password)}`

    // START: check if email and number phone have registered
    const user = await findUserbyEmail(value.email)

    if (user?.data?.length !== 0) {
      return res.status(412).send({
        status: false,
        statusCode: 412,
        message: 'Email is Already register, please use the different email'
      })
    }
    // END: check if email and number phone have registered

    // hit function createuser service
    const regist = await createUser(value)

    // throw error is failed regist
    if (!regist.msg && regist.msg !== 'success') {
      return res.status(412).send({ status: false, statusCode: 412, message: 'Failed Register User, please try again' })
    }

    // return if success
    logger.info('Register successfully, please login')
    return res.send({ status: 0, message: 'Registrasi berhasil silahkan login', data: null })
  } catch (error: any) {
    logger.error('ERR: auth - regist = ', error)
    return res.send({ status: 102, message: error, data: null })
  }
}

// login
export const createSession = async (req: Request, res: Response) => {
  // START: validation payload
  const { error, value } = loginValidation(req.body)
  if (error) {
    logger.error('ERR: auth - login = ', error.details[0].message)
    return res.send({ status: 102, message: error.details[0].message, data: null })
  }
  // END: validation payload
  try {
    // checking user by email
    const user = await findUserbyEmail(value.email)

    // declare variabel
    let password, id, email

    if (user.data.length !== 0) {
      password = user.data[0]?.password
      id = user.data[0]?.id
      email = user.data[0]?.email
    } else {
      return res.status(401).send({ status: false, statusCode: 401, message: 'Invalid credentials' })
    }

    // validation if password or email undefined
    if (!password || !email) {
      return res.status(401).send({ status: false, statusCode: 401, message: 'Not found account' })
    }

    // checking password
    const isValidPassword = checkPassword(value.password, password)
    if (!isValidPassword) {
      return res.status(401).send({ status: false, statusCode: 401, message: 'Invalid password' })
    }

    // signJWT for access and refresh token
    const accessToken = signJWT({ ...user.data[0] }, { expiresIn: '1d' })
    const refreshToken = signJWT({ ...user.data[0] }, { expiresIn: '1y' })

    if (!accessToken || !refreshToken) {
      return res.status(401).send({ status: false, statusCode: 401, message: 'Invalid credential, please try again' })
    }

    // save auth
    await createAuth({
      access_token: accessToken,
      refresh_token: refreshToken,
      user_id: id,
      is_login: true
    })

    return res.send({ status: 0, statusCode: 201, message: 'login success', data: { accessToken, refreshToken } })
  } catch (error: any) {
    logger.error('ERR: auth - login = ', error)
    return res.send({ status: 102, message: error, data: null })
  }
}

// refresh token
export const refreshSession = async (req: Request, res: Response) => {
  // START: validation payload
  const { error, value } = refreshSessionValidation(req.body)
  if (error) {
    logger.error('ERR: auth - refresh session = ', error.details[0].message)
    return res.send({ status: 102, message: error.details[0].message, data: null })
  }
  // END: validation payload
  try {
    // refresh token
    const refresh = await reIssueAccessToken(value.refreshToken)
    if (typeof refresh === 'boolean') {
      return res.status(404).send({ status: false, statusCode: 404, message: 'user not found' })
    }

    // update access token in db
    await updateAccessToken(refresh)

    return res.send({ status: 0, message: 'refresh session success', data: { accessToken: refresh } })
  } catch (error: any) {
    logger.error('ERR: auth - refresh session = ', error)
    return res.send({ status: 102, message: error, data: null })
  }
}

// logout
export const destroySession = async (req: Request, res: Response) => {
  // START: validation payload
  const { error, value } = destroySessionValidation(req.body)
  if (error) {
    logger.error('ERR: auth - destroy session = ', error.details[0].message)
    return res.send({ status: 102, message: error.details[0].message, data: null })
  }
  // END: validation payload
  try {
    // destroy
    await destroyAuth(value.accessToken)
    return res.send({ status: 0, message: 'logout success' })
  } catch (error: any) {
    logger.error('ERR: auth - auth session = ', error)
    return res.send({ status: 102, message: error, data: null })
  }
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await findUserbyEmail(req.locals.email)
    return res.send({ status: 0, message: 'Sukses', data: { ...user.data[0] } })
  } catch (error) {
    logger.error('ERR: profile - get = ', error)
    return res.send({ status: 102, message: error, data: null })
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  // START: validation payload
  const { error, value } = updateProfileValidation(req.body)
  if (error) {
    logger.error('ERR: profile - update profile = ', error.details[0].message)
    return res.send({ status: 102, message: error.details[0].message, data: null })
  }
  // END: validation payload
  try {
    const payload = {
      first_name: value.first_name,
      last_name: value.last_name,
      user_id: req.locals.id
    }

    const update = await updateName(payload)
    return res.send({ status: 0, message: 'Update Pofile berhasil', data: { ...update[0] } })
  } catch (error) {
    logger.error('ERR: profile - update = ', error)
    return res.send({ status: 102, message: error, data: null })
  }
}

export const updateProfileImage = async (req: Request, res: Response) => {
  try {
    // Handle file upload
    upload(req, res, async (err: any) => {
      if (err) {
        console.log('cek', err)
        logger.error('ERR: profile - upload image = ', err.message)
        return res.status(400).send({ status: 102, message: err.message, data: null })
      } else {
        if (req.file === undefined) {
          return res.status(400).send({ status: 102, message: 'No file selected', data: null })
        } else {
          try {
            const userId = req.locals.id
            const profileImagePath = req.file.path
            const updatedUser = await updateProfileImageService(userId, profileImagePath)
            console.log(updatedUser)
            res.status(200).send({ status: 200, message: 'Profile image updated successfully', data: updatedUser })
          } catch (error: any) {
            logger.error('ERR: profile - update profile image = ', error.message)
            res.status(500).send({ status: 500, message: 'Internal server error', data: null })
          }
        }
      }
    })
  } catch (error) {
    logger.error('ERR: profile - update image = ', error)
    return res.send({ status: 102, message: error, data: null })
  }
}
