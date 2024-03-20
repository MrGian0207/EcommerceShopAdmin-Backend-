import LoginController from '../admin/controllers/LoginController';
import { Router } from 'express';

const loginController = new LoginController();
const loginRouter = Router();

loginRouter.post('/login', loginController.login);

export default loginRouter;
