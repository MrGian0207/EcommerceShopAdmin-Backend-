import { Router } from 'express'

import LoginController from '../admin/controllers/Authorization/LoginController'

const loginController = new LoginController()
const loginRouter = Router()

loginRouter.post('/auth/login', loginController.login)
loginRouter.get('/index', loginController.index)

export default loginRouter
