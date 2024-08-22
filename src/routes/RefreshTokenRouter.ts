import { Router } from 'express'

import RefreshTokenController from '../admin/controllers/Token/RefreshTokenController'

const refreshTokenController = new RefreshTokenController()
const refreshTokenRouter = Router()

refreshTokenRouter.post('/refreshToken', refreshTokenController.refreshToken)

export default refreshTokenRouter
