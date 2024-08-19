import SubCategoriesController from '../admin/controllers/Categories/SubCategoriesController';
import { Router } from 'express';
import upload from '../services/multer';
import authenToken from '../middlewares/authenToken';

const subCategoriesController = new SubCategoriesController();
const subCategoriesRouter = Router();

subCategoriesRouter.post(
   '/categories/sub-categories/add',
   authenToken,
   upload.single('image'),
   subCategoriesController.store,
);

subCategoriesRouter.get(
   '/categories/sub-categories',
   authenToken,
   subCategoriesController.getAll,
);

subCategoriesRouter.get(
   '/categories/sub-categories/name',
   authenToken,
   subCategoriesController.subCategories,
);

subCategoriesRouter.get(
   '/categories/sub-categories/:id',
   authenToken,
   subCategoriesController.getOne,
);

subCategoriesRouter.post(
   '/categories/sub-categories/:id',
   authenToken,
   upload.single('image'),
   subCategoriesController.update,
);

subCategoriesRouter.delete(
   '/categories/sub-categories/delete/:id',
   authenToken,
   subCategoriesController.deleteOne,
);

export default subCategoriesRouter;
