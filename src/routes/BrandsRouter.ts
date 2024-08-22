import { Router } from 'express'

import BrandsController from '../admin/controllers/Brands/BrandsController'
import authenToken from '../middlewares/authenToken'
import upload from '../services/multer'

const brandsController = new BrandsController()
const brandsRouter = Router()

brandsRouter.post('/brands/add', upload.single('image'), brandsController.store)

brandsRouter.get('/brands', authenToken, brandsController.getAll)

brandsRouter.get('/brands/name', authenToken, brandsController.brands)

brandsRouter.get('/brands/:id', authenToken, brandsController.getOne)

brandsRouter.post('/brands/:id', authenToken, upload.single('image'), brandsController.update)

brandsRouter.delete('/brands/delete/:id', brandsController.deleteOne)

export default brandsRouter
