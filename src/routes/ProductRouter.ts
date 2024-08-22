import { Router } from 'express'

import ProductController from '../admin/controllers/Product/ProductController'
import authenToken from '../middlewares/authenToken'
import upload from '../services/multer'

const productController = new ProductController()
const productRouter = Router()

productRouter.post('/products/add', upload.array('variantImages', 20), productController.store)
productRouter.post('/products/:id', upload.array('variantImages', 20), productController.update)
productRouter.get('/products', authenToken, productController.getAll)
productRouter.put('/products/:id', authenToken, productController.activeProducts)
productRouter.get('/products/:id', authenToken, productController.getOne)
productRouter.delete('/products/delete/:id', authenToken, productController.deleteOne)

export default productRouter
