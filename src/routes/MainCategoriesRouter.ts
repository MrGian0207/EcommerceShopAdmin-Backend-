import MainCategoriesController from '../admin/controllers/MainCategories/MainCategoriesController';
import { Router } from 'express';
import upload from '../services/multer';

const mainCategoriesController = new MainCategoriesController();
const mainCategoriesRouter = Router();

mainCategoriesRouter.post(
    '/categories/main-categories/add',
    upload.single('category-image'),
    mainCategoriesController.store,
);

export default mainCategoriesRouter;
