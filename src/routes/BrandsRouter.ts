import BrandsController from '../admin/controllers/Brands/BrandsController';
import { Router } from 'express';
import upload from '../services/multer';

const brandsController = new BrandsController();
const brandsRouter = Router();

brandsRouter.post(
    '/brands/add',
    upload.single('brands-image'),
    brandsController.store,
);

brandsRouter.get('/brands', brandsController.getAll);

brandsRouter.get('/brands/name', brandsController.brands);

brandsRouter.get('/brands/:id', brandsController.getOne);

brandsRouter.post(
    '/brands/:id',
    upload.single('brands-image'),
    brandsController.update,
);

brandsRouter.delete('/brands/delete/:id', brandsController.deleteOne);

export default brandsRouter;
