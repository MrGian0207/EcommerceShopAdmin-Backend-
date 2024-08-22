import { Router } from 'express'

import LogoutController from '../admin/controllers/Authorization/LogoutController'

const logoutController = new LogoutController()
const logoutRouter = Router()

logoutRouter.post('/logout', logoutController.logout)

export default logoutRouter
