// import { type Request, type Response, type NextFunction } from 'express'
// import { logger } from '../config/logger'
// import prisma from '../config/prisma'

// const logErrMonitorMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//   res.on('finish', async () => {
//     // Log error details to the database only if there's an error
//     if (res.statusCode >= 400) {
//       try {
//         if (req.path === '/login' || req.path === '/register' || req.path === '/refreshToken') {
//           await prisma.log_err.create({
//             data: {
//               endpoint: req.originalUrl,
//               response: JSON.stringify(res.statusMessage),
//               payload: JSON.stringify(req.body),
//               status_code: res.statusCode,
//               created_at: new Date(),
//               is_auth: true
//             }
//           })
//         } else {
//           await prisma.log_err.create({
//             data: {
//               endpoint: req.path,
//               response: JSON.stringify(res.statusCode),
//               payload: JSON.stringify(req.body),
//               status_code: res.statusCode,
//               created_at: new Date(),
//               created_id: req.locals ? req.locals.id : null,
//               is_auth: false
//             }
//           })
//         }
//         logger.info('Error log saved to the database')
//       } catch (error: any) {
//         console.log(error)
//         logger.error('Error saving to the database:', error)
//       }
//     }
//   })

//   next()
// }

// export default logErrMonitorMiddleware
