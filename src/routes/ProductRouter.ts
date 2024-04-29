import ProductController from '../admin/controllers/Product/ProductController';
import { Router } from 'express';
import upload from '../services/multer';
import authenToken from '../middlewares/authenToken';

const productController = new ProductController();
const productRouter = Router();

productRouter.post(
  '/products/add',
  upload.array('product-variant-image', 20),
  productController.store,
);
productRouter.post(
  '/products/:id',
  upload.array('product-variant-image', 20),
  productController.update,
);
productRouter.get('/products', authenToken, productController.getAll);
productRouter.put('/products', authenToken, productController.activeProducts);
productRouter.get('/products/:id', authenToken, productController.getOne);
productRouter.delete(
  '/products/delete/:id',
  authenToken,
  productController.deleteOne,
);

export default productRouter;
