import UsersController from '../admin/controllers/Users/UsersController';
import { Router } from 'express';
import upload from '../services/multer';

const usersController = new UsersController();
const usersRouter = Router();

usersRouter.get('/users', usersController.getAll);
usersRouter.get('/users/:id', usersController.getOne);
usersRouter.put('/users', upload.single('users-image'), usersController.update);

export default usersRouter;
