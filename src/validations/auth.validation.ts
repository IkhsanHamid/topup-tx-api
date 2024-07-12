import Joi from 'joi'
import { type update, type userType } from '../types/user.type'

export const createUserValidation = (payload: userType) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    first_name: Joi.string().required().min(3),
    last_name: Joi.string().required().min(3),
    password: Joi.string().required().min(8)
  })

  return schema.validate(payload)
}

export const loginValidation = (payload: userType) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  })

  return schema.validate(payload)
}

export const refreshSessionValidation = (payload: userType) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required()
  })

  return schema.validate(payload)
}

export const destroySessionValidation = (payload: userType) => {
  const schema = Joi.object({
    accessToken: Joi.string().required()
  })

  return schema.validate(payload)
}

export const updateProfileValidation = (payload: update) => {
  const schema = Joi.object({
    first_name: Joi.string().min(3).required(),
    last_name: Joi.string().min(3).required()
  })

  return schema.validate(payload)
}
