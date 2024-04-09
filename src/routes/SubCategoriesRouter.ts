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

export default subCategoriesRouter;
