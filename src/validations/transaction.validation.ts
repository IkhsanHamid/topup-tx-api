import Joi from 'joi'
import { type txHistory, type topupType } from '../types/transaction.type'

export const topUpValidation = (payload: topupType) => {
  const schema = Joi.object({
    top_up_amount: Joi.number().required().min(1)
  })
  return schema.validate(payload)
}

export const transactionValidation = (payload: topupType) => {
  const schema = Joi.object({
    service_code: Joi.string().required().min(1)
  })
  return schema.validate(payload)
}

export const txHistoryValidation = (payload: txHistory) => {
  const schema = Joi.object({
    skip: Joi.number().required().min(0),
    limit: Joi.number().required().min(1),
    userId: Joi.number().required().min(1)
  })
  return schema.validate(payload)
}
