import { Router } from 'express'

import NewletterController from '../admin/controllers/Newletter/NewletterController'
import authenToken from '../middlewares/authenToken'

const newletterController = new NewletterController()
const newletterRouter = Router()

newletterRouter.post('/newletter/add', authenToken, newletterController.store)
newletterRouter.get('/newletter', authenToken, newletterController.getAll)

export default newletterRouter
