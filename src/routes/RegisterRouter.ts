import RegisterController from '../admin/controllers/Authorization/RegisterController';
import { Router } from 'express';

const registerController = new RegisterController();
const registerRouter = Router();

registerRouter.post('/auth/register', registerController.store);

export default registerRouter;
