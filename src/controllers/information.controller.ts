import { type Request, type Response } from 'express'
import { logger } from '../config/logger'
import { getBanner, getService } from '../services/information.service'

export const showBanner = async (req: Request, res: Response) => {
  try {
    const banner = await getBanner()
    return res.send({ status: 0, message: 'Sukses', data: banner.data })
  } catch (error) {
    logger.error('ERR: information - banner = ', error)
    return res.send({ status: 102, message: error, data: null })
  }
}

export const showService = async (req: Request, res: Response) => {
  try {
    const service = await getService()

    return res.send({ status: 0, message: 'Sukses', data: service.data })
  } catch (error) {
    logger.error('ERR: information - service = ', error)
    return res.send({ status: 102, message: error, data: null })
  }
}
