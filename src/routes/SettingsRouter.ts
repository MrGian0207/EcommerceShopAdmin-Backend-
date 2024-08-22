import { Router } from 'express'

import SettingsController from '../admin/controllers/Settings/SettingsController'
import authenToken from '../middlewares/authenToken'

const settingsController = new SettingsController()
const settingsRouter = Router()

settingsRouter.get('/settings', authenToken, settingsController.getUser)
settingsRouter.post('/settings/addRole', authenToken, settingsController.addUserWithRole)
settingsRouter.put('/settings/update-password', authenToken, settingsController.changePassword)

export default settingsRouter
