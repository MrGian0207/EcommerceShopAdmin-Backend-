import { Router } from 'express'

import UsersController from '../admin/controllers/Users/UsersController'
import authenToken from '../middlewares/authenToken'
import upload from '../services/multer'

const usersController = new UsersController()
const usersRouter = Router()

usersRouter.get('/users', authenToken, usersController.getAll)
usersRouter.get('/users/:id', authenToken, usersController.getOne)
usersRouter.put('/users/:id', authenToken, upload.single('image'), usersController.update)

export default usersRouter
