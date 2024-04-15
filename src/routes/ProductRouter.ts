import ProductController from '../admin/controllers/Product/ProductController';
import { Router } from 'express';
import upload from '../services/multer';

const productController = new ProductController();
const productRouter = Router();

productRouter.post(
    '/products/add',
    upload.array('product-variant-image', 20),
    productController.store,
);

export default productRouter;