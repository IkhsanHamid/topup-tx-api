import { type service, type banner } from '../types/banner.type'
import { logger } from '../config/logger'
import prisma, { handlePrismaError } from '../config/prisma'

export const getBanner = async () => {
  try {
    const banner: banner[] = await prisma.$queryRaw`
        SELECT banner_namer, banner_image, description FROM banner
    `
    return Promise.resolve({
      msg: 'Success',
      data: banner[0]
    })
  } catch (error) {
    const formattedError = handlePrismaError(error)
    logger.error('Cannot get banner')
    return Promise.reject(formattedError)
  }
}

export const getService = async () => {
  try {
    const service: service[] = await prisma.$queryRaw`
      SELECT service_code, service_name, service_icon, service_tarif FROM services;
    `

    return Promise.resolve({
      msg: 'Success',
      data: service
    })
  } catch (error) {
    const formattedError = handlePrismaError(error)
    logger.error('Cannot get service')
    return Promise.reject(formattedError)
  }
}
