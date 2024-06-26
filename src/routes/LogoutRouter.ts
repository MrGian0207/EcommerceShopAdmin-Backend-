import LogoutController from '../admin/controllers/Authorization/LogoutController';
import { Router } from 'express';

const logoutController = new LogoutController();
const logoutRouter = Router();

logoutRouter.post('/logout', logoutController.logout);

export default logoutRouter;
