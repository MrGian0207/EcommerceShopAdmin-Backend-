import RegisterController from '../admin/controllers/RegisterController';
import { Router } from 'express';

const registerController = new RegisterController();
const registerRouter = Router();

registerRouter.post('/register', registerController.store);

export default registerRouter;
