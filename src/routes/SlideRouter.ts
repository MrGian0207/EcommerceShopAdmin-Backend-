import SlideController from '../admin/controllers/Slide/SlideController';
import { Router } from 'express';
import upload from '../services/multer';

const slideController = new SlideController();
const slideRouter = Router();

slideRouter.post(
  '/slides/add',
  upload.single('slide-image'),
  slideController.store,
);

slideRouter.get('/slides', slideController.getAll);

export default slideRouter;
