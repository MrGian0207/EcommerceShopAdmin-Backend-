import { Router } from 'express'

import ForgotPasswordController from '../admin/controllers/Authorization/ForgotPasswordController'

const forgotPasswordController = new ForgotPasswordController()
const forgotPasswordRouter = Router()

forgotPasswordRouter.post('/auth/forgot-password', forgotPasswordController.forgotPassword)

export default forgotPasswordRouter
