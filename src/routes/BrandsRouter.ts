import BrandsController from '../admin/controllers/Brands/BrandsController';
import { Router } from 'express';
import upload from '../services/multer';
import authenToken from '../middlewares/authenToken';

const brandsController = new BrandsController();
const brandsRouter = Router();

brandsRouter.post(
  '/brands/add',
  upload.single('brands-image'),
  brandsController.store,
);

brandsRouter.get('/brands', authenToken, brandsController.getAll);

brandsRouter.get('/brands/name', authenToken, brandsController.brands);

brandsRouter.get('/brands/:id', authenToken, brandsController.getOne);

brandsRouter.post(
  '/brands/:id',
  authenToken,
  upload.single('brands-image'),
  brandsController.update,
);

brandsRouter.delete('/brands/delete/:id', brandsController.deleteOne);

export default brandsRouter;
