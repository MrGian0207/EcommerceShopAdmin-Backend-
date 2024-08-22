import { Router } from 'express'

import MainCategoriesController from '../admin/controllers/Categories/MainCategoriesController'
import authenToken from '../middlewares/authenToken'
import upload from '../services/multer'

const mainCategoriesController = new MainCategoriesController()
const mainCategoriesRouter = Router()

mainCategoriesRouter.post(
  '/categories/main-categories/add',
  authenToken,
  upload.single('image'),
  mainCategoriesController.store
)

mainCategoriesRouter.get(
  '/categories/main-categories',
  authenToken,
  mainCategoriesController.getAll
)

mainCategoriesRouter.get(
  '/categories/main-categories/name',
  authenToken,
  mainCategoriesController.categories
)

mainCategoriesRouter.get(
  '/categories/main-categories/:id',
  authenToken,
  mainCategoriesController.getOne
)

mainCategoriesRouter.post(
  '/categories/main-categories/:id',
  authenToken,
  upload.single('image'),
  mainCategoriesController.update
)

mainCategoriesRouter.delete(
  '/categories/main-categories/delete/:id',
  authenToken,
  mainCategoriesController.deleteOne
)

export default mainCategoriesRouter
