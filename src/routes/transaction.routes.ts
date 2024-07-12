import { Router } from 'express'
import { checkBalance, generateTx, topUpBalance, txHistory } from '../controllers/transaction.controller'
import { requireUser } from '../middleware/auth'

export const transactionRouter: Router = Router()

transactionRouter.get('/balance', requireUser, checkBalance)
transactionRouter.post('/topup', requireUser, topUpBalance)
transactionRouter.post('/transaction', requireUser, generateTx)
transactionRouter.get('/transaction/history', requireUser, txHistory)
