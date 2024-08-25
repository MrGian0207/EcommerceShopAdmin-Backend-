import { Router } from 'express'

import ProductController from '../admin/controllers/Product/ProductController'
import authenToken from '../middlewares/authenToken'
import upload from '../services/multer'

const productController = new ProductController()
const productRouter = Router()

productRouter.post('/product/add', upload.array('variantImages', 20), productController.store)
productRouter.post('/product/:id', upload.array('variantImages', 20), productController.update)
productRouter.get('/product', authenToken, productController.getAll)
productRouter.put('/product/:id', authenToken, productController.activeProducts)
productRouter.get('/product/:id', authenToken, productController.getOne)
productRouter.delete('/product/delete/:id', authenToken, productController.deleteOne)

export default productRouter
