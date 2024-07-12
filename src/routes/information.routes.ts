import { Router } from 'express'
import { showBanner, showService } from '../controllers/information.controller'

export const informationRouter: Router = Router()

informationRouter.get('/banner', showBanner)
informationRouter.get('/service', showService)
