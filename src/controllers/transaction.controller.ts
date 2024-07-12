import { type Request, type Response } from 'express'
import { generateTransaction, getBalance, topup, transactionHistory } from '../services/transaction.service'
import { logger } from '../config/logger'
import { topUpValidation, transactionValidation } from '../validations/transaction.validation'

export const checkBalance = async (req: Request, res: Response) => {
  try {
    const balance = await getBalance(req.locals.id)

    return res.send({ status: 0, message: 'Sukses', data: balance.data })
  } catch (error) {
    logger.error('ERR: transaction - balance = ', error)
    return res.send({ status: 102, message: error, data: null })
  }
}

export const topUpBalance = async (req: Request, res: Response) => {
  // START: validation payload
  const { error, value } = topUpValidation(req.body)
  if (error) {
    logger.error('ERR: transaction - top up balance = ', error.details[0].message)
    return res.send({ status: 102, message: error.details[0].message, data: null })
  }
  // END: validation payload
  try {
    const balance = await topup(value.top_up_amount, req.locals.id)
    return res.send({ status: 0, message: 'Top Up Balance berhasil', data: { balance: balance.data[0].balance } })
  } catch (error) {
    logger.error('ERR: transaction - top up balance = ', error)
    return res.send({ status: 102, message: error, data: null })
  }
}

export const generateTx = async (req: Request, res: Response) => {
  // START: validation payload
  const { error, value } = transactionValidation(req.body)
  if (error) {
    logger.error('ERR: transaction - transaction = ', error.details[0].message)
    return res.send({ status: 102, message: error.details[0].message, data: null })
  }
  // END: validation payload
  try {
    const tx = await generateTransaction(value.service_code, req.locals.id)
    return res.send({ status: 0, message: 'Transaksi berhasil', data: { ...tx.data } })
  } catch (error) {
    logger.error('ERR: transaction - transaction = ', error)
    return res.send({ status: 102, message: error, data: null })
  }
}

export const txHistory = async (req: Request, res: Response) => {
  try {
    const { skip, limit } = req.query
    const history = await transactionHistory(Number(skip), Number(limit), req.locals.id)
    return res.send({ status: 0, message: 'Get History Berhasil', data: history.data })
  } catch (error) {
    logger.error('ERR: transaction - history = ', error)
    return res.send({ status: 102, message: error, data: null })
  }
}
