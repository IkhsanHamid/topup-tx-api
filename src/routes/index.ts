/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Application, type Router } from 'express'
import { authRouter } from './auth.routes'
import { informationRouter } from './information.routes'
import { transactionRouter } from './transaction.routes'

const _routes: Array<[string, Router]> = [
  ['/api/v1/auth', authRouter],
  ['/api/v1/information', informationRouter],
  ['/api/v1/tx', transactionRouter]
]

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, router] = route
    app.use(url, router)
  })
}
