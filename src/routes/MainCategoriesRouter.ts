import MainCategoriesController from '../admin/controllers/Categories/MainCategoriesController';
import { Router } from 'express';
import upload from '../services/multer';

const mainCategoriesController = new MainCategoriesController();
const mainCategoriesRouter = Router();

mainCategoriesRouter.post(
    '/categories/main-categories/add',
    upload.single('category-image'),
    mainCategoriesController.store,
);

mainCategoriesRouter.get(
    '/categories/main-categories',
    mainCategoriesController.getAll,
);

mainCategoriesRouter.get(
    '/categories/main-categories/parent-categories',
    mainCategoriesController.getParentCategories,
);

mainCategoriesRouter.get(
    '/categories/main-categories/:id',
    mainCategoriesController.getOne,
);

mainCategoriesRouter.post(
    '/categories/main-categories/:id',
    upload.single('category-image'),
    mainCategoriesController.update,
);

mainCategoriesRouter.delete(
    '/categories/main-categories/delete/:id',
    mainCategoriesController.deleteOne,
);

export default mainCategoriesRouter;
