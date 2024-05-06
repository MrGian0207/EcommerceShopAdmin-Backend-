import UsersController from '../admin/controllers/Users/UsersController';
import { Router } from 'express';
import upload from '../services/multer';
import authenToken from '../middlewares/authenToken';

const usersController = new UsersController();
const usersRouter = Router();

usersRouter.get('/users',usersController.getAll);
usersRouter.get('/users/:id', authenToken, usersController.getOne);
usersRouter.put(
  '/users',
  authenToken,
  upload.single('users-image'),
  usersController.update,
);

export default usersRouter;
