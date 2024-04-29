import SlideController from '../admin/controllers/Slide/SlideController';
import { Router } from 'express';
import upload from '../services/multer';
import authenToken from '../middlewares/authenToken';

const slideController = new SlideController();
const slideRouter = Router();

slideRouter.post(
  '/slides/add',
  authenToken,
  upload.single('slide-image'),
  slideController.store,
);

slideRouter.get('/slides', authenToken, slideController.getAll);
slideRouter.get('/slides/:id', authenToken, slideController.getOne);
slideRouter.post(
  '/slides/:id',
  authenToken,
  upload.single('slide-image'),
  slideController.update,
);
slideRouter.delete(
  '/slides/delete/:id',
  authenToken,
  slideController.deleteOne,
);
export default slideRouter;
