import SubCategoriesController from '../admin/controllers/Categories/SubCategoriesController';
import { Router } from 'express';
import upload from '../services/multer';

const subCategoriesController = new SubCategoriesController();
const subCategoriesRouter = Router();

subCategoriesRouter.post(
    '/categories/sub-categories/add',
    upload.single('sub-category-image'),
    subCategoriesController.store,
);

subCategoriesRouter.get(
    '/categories/sub-categories',
    subCategoriesController.getAll,
);

subCategoriesRouter.get(
    '/categories/sub-categories/:id',
    subCategoriesController.getOne,
);

subCategoriesRouter.post(
    '/categories/sub-categories/:id',
    upload.single('sub-category-image'),
    subCategoriesController.update,
);

export default subCategoriesRouter;
