import { Router } from 'express'

import RegisterController from '../admin/controllers/Authorization/RegisterController'

const registerController = new RegisterController()
const registerRouter = Router()

registerRouter.post('/auth/register', registerController.store)

export default registerRouter
