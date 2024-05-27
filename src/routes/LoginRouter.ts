import LoginController from '../admin/controllers/Authorization/LoginController';
import { Router } from 'express';

const loginController = new LoginController();
const loginRouter = Router();

loginRouter.post('/auth/login', loginController.login);
loginRouter.get('/index', loginController.index);

export default loginRouter;
