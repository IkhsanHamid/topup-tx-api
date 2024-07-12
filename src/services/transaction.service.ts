/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { type transactionModel, type balance, type topupType, type history } from '../types/transaction.type'
import { logger } from '../config/logger'
import prisma, { handlePrismaError } from '../config/prisma'
import { type service } from '../types/banner.type'

const generateInvoiceNumber = async () => {
  try {
    const today = new Date()
    const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, '')

    const lastInvoice = await prisma.transaction.findFirst({
      orderBy: {
        id: 'desc'
      }
    })

    let nextNumber = 1
    if (lastInvoice && lastInvoice?.invoice_number) {
      const lastInvoiceNumber = lastInvoice.invoice_number?.split('-')[1]
      nextNumber = parseInt(lastInvoiceNumber) + 1
    }
    const invoiceNumber = `INV${datePrefix}-${String(nextNumber).padStart(3, '0')}`
    return invoiceNumber
  } catch (error) {
    logger.error('Cannot generate invoice number', error)
    throw new Error('Cannot generate invoice number')
  }
}

export const getBalance = async (userId: number) => {
  try {
    const balance: balance[] = await prisma.$queryRaw`
        SELECT balance FROM balance WHERE user_id = ${userId}
    `
    return Promise.resolve({
      msg: 'success',
      data: balance
    })
  } catch (error) {
    const formattedError = handlePrismaError(error)
    logger.error('Cannot get balance')
    return Promise.reject(formattedError)
  }
}

export const topup = async (amount: number, userId: number) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    try {
      // Find if balance exists
      const saldo = await getBalance(userId)
      let topup: topupType[]

      if (saldo.data.length === 0) {
        // Create new balance
        topup = await prisma.$queryRaw`
          INSERT INTO balance (balance, user_id)
          VALUES (${amount}, ${userId})
          RETURNING *; 
        `
      } else {
        // Update existing balance
        topup = await prisma.$queryRaw`
          UPDATE balance
          SET balance = ${saldo.data[0].balance + amount}
          WHERE user_id = ${userId}
          RETURNING *; 
        `
      }

      // Generate invoice number
      const invoice = await generateInvoiceNumber()
      const createdAt = new Date()

      // Insert the transaction
      await prisma.$queryRaw`
        INSERT INTO transaction (invoice_number, transaction_type, total_amount, created_on, user_id)
        VALUES (${invoice}, 'TOPUP', ${amount}, ${createdAt}, ${userId});
      `

      return {
        msg: 'success',
        data: topup
      }
    } catch (error) {
      console.log(error)
      logger.error('Transaction failed', error)
      throw new Error('Transaction failed')
    }
  })

  return transaction
}

export const generateTransaction = async (serviceCode: string, userId: number) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    try {
      const service: service[] = await prisma.$queryRaw`
        SELECT id, service_code, service_tarif, service_name 
        FROM services 
        WHERE service_code = ${serviceCode}
      `

      if (service.length === 0) {
        throw new Error('Service not found')
      }

      // Check user's balance
      const balance = await getBalance(userId)
      if (balance.data.length === 0 || balance.data[0].balance < service[0].service_tarif) {
        throw new Error('Insufficient balance, please top up')
      }

      // Generate invoice number
      const invoice = await generateInvoiceNumber()
      const createdAt = new Date()

      // Insert the transaction
      const tx: transactionModel[] = await prisma.$queryRaw`
        INSERT INTO transaction (invoice_number, transaction_type, total_amount, created_on, user_id, service_id)
        VALUES (${invoice}, 'PAYMENT', ${service[0].service_tarif}, ${createdAt}, ${userId}, ${service[0].id})
        RETURNING *;
      `
      // Update the balance
      await prisma.$queryRaw`
        UPDATE balance 
        SET balance = ${balance.data[0].balance - service[0].service_tarif}
        WHERE user_id = ${userId}
      `

      return {
        msg: 'success',
        data: {
          invoice_number: tx[0].invoice_number,
          service_code: serviceCode,
          service_name: service[0].service_name,
          transaction_type: tx[0].transaction_type,
          total_amount: tx[0].total_amount,
          created_on: tx[0].created_on
        }
      }
    } catch (error) {
      logger.error('Transaction error', error)
      throw new Error('Transaction failed')
    }
  })

  return transaction
}

export const transactionHistory = async (skip: number, limit: number, userId: number) => {
  try {
    const history: history[] = await prisma.$queryRaw`
            SELECT 
                t.invoice_number, 
                t.transaction_type, 
                s.service_name as description,
                t.total_amount, 
                t.created_on
            FROM 
            transaction t
            LEFT JOIN 
                services s ON s.id = t.service_id
            WHERE 
                t.user_id = ${userId};
        `

    return {
      msg: 'success',
      data: history
    }
  } catch (error) {
    const formattedError = handlePrismaError(error)
    logger.error('Cannot get transaction')
    return Promise.reject(formattedError)
  }
}
