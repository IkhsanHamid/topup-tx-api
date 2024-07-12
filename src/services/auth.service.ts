import { type userType, type User, type update } from '../types/user.type'
import { logger } from '../config/logger'
import { type AuthType, type SessionType } from '../types/auth.type'
import prisma, { handlePrismaError } from '../config/prisma'

export const createUser = async (payload: userType) => {
  try {
    const user = await prisma.$queryRaw`
      INSERT INTO users (first_name, last_name, password, email) 
      VALUES (${payload.first_name}, ${payload.last_name}, ${payload.password}, ${payload.email})
      RETURNING *;
    `

    return Promise.resolve({
      msg: 'success',
      data: user
    })
  } catch (error) {
    const formattedError = handlePrismaError(error)
    logger.error('Cannot create user')
    return Promise.reject(formattedError)
  }
}

export const findUserbyEmail = async (email: string) => {
  try {
    const user: User[] = await prisma.$queryRaw`
      SELECT * FROM users WHERE email=${email};
    `
    return Promise.resolve({
      msg: 'success',
      data: user
    })
  } catch (error) {
    const formattedError = handlePrismaError(error)
    logger.error('Cannot find user')
    return Promise.reject(formattedError)
  }
}

export const createAuth = async (payload: AuthType) => {
  try {
    const findAuth: AuthType[] = await prisma.$queryRaw`
      SELECT * FROM authentication WHERE user_id=${payload.user_id}
    `

    if (findAuth.length !== 0) {
      throw new Error('Double Login!')
    }

    await prisma.$transaction([
      prisma.$queryRaw`
        INSERT INTO authentication (access_token, refresh_token, user_id)
        VALUES (${payload.access_token}, ${payload.refresh_token}, ${payload.user_id});
      `,
      prisma.$queryRaw`
        UPDATE users SET is_login = true WHERE id = ${payload.user_id};
      `
    ])

    return Promise.resolve({
      msg: 'success',
      data: { ...payload }
    })
  } catch (error) {
    const formattedError = handlePrismaError(error)
    logger.error('Cannot create auth', error)
    return Promise.reject(formattedError)
  }
}

export const destroyAuth = async (token: string) => {
  try {
    await prisma.$queryRaw`
      DELETE FROM authentication WHERE authentication.access_token = ${token};
    `
    return Promise.resolve({
      msg: 'success'
    })
  } catch (error) {
    const formattedError = handlePrismaError(error)
    logger.error('Cannot destroy auth', error)
    return Promise.reject(formattedError)
  }
}

export const findAccessToken = async (userId: any) => {
  try {
    const findAuth = await prisma.$queryRaw`
      SELECT * FROM authentication WHERE user_id = ${userId};
    `
    return Promise.resolve(findAuth)
  } catch (error) {
    const formattedError = handlePrismaError(error)
    return Promise.reject(formattedError)
  }
}

export const updateAccessToken = async (token: SessionType) => {
  try {
    const updatedAuth = await prisma.$transaction(async (transaction) => {
      const user: User[] = await transaction.$queryRaw`
        SELECT * FROM authentication WHERE user_id = ${token.user_id};
      `

      if (user.length === 0) {
        throw new Error('User not found')
      }

      const auth = await transaction.$queryRaw`
        UPDATE authentication
        SET access_token = ${token.accessToken}
        WHERE id = ${user[0].id}
        RETURNING *;
      `

      return auth
    })

    return Promise.resolve({
      msg: 'success',
      data: updatedAuth
    })
  } catch (error) {
    const formattedError = handlePrismaError(error)
    return Promise.reject(formattedError)
  }
}

export const updateName = async (payload: update) => {
  try {
    const update: User[] = await prisma.$queryRaw`
      UPDATE users SET first_name = ${payload.first_name}, last_name = ${payload.last_name}
      WHERE id = ${payload.user_id}
      RETURNING *;
    `
    return update
  } catch (error) {
    const formattedError = handlePrismaError(error)
    return Promise.reject(formattedError)
  }
}

export const updateProfileImageService = async (userId: number, profileImagePath: string) => {
  try {
    const updatedUser = await prisma.$queryRaw`
      UPDATE users
      SET profile_image = ${profileImagePath}
      WHERE id = ${userId}
      RETURNING *;
    `
    return updatedUser
  } catch (error) {
    logger.error('Cannot update profile image', error)
    throw error
  }
}
