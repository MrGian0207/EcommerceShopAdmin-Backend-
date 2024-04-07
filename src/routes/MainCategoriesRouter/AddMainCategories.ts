import AddMainCategoriesController from '../../admin/controllers/AddMainCategoriesController';
import { Router } from 'express';
import upload from '../../services/multer';

const addMainCategoriesController = new AddMainCategoriesController();
const addMainCategoriesRouter = Router();

addMainCategoriesRouter.post(
    '/categories/main-categories/add',
    upload.single('category-image'),
    addMainCategoriesController.store,
);

export default addMainCategoriesRouter;
