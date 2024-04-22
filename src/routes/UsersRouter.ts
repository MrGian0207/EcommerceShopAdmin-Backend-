import UsersController from '../admin/controllers/Users/UsersController';
import { Router } from 'express';

const usersController = new UsersController();
const usersRouter = Router();

usersRouter.get('/users', usersController.getAll);
usersRouter.get('/users/:id', usersController.getOne);

export default usersRouter;
