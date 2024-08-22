import { Router } from 'express'

import SlideController from '../admin/controllers/Slide/SlideController'
import authenToken from '../middlewares/authenToken'
import upload from '../services/multer'

const slideController = new SlideController()
const slideRouter = Router()

slideRouter.post('/slides/add', authenToken, upload.single('image'), slideController.store)

slideRouter.get('/slides', authenToken, slideController.getAll)
slideRouter.get('/slides/:id', authenToken, slideController.getOne)
slideRouter.post('/slides/:id', authenToken, upload.single('image'), slideController.update)
slideRouter.delete('/slides/delete/:id', authenToken, slideController.deleteOne)
export default slideRouter
