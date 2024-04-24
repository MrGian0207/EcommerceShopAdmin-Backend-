import NewletterController from '../admin/controllers/Newletter/NewletterController';
import { Router } from 'express';

const newletterController = new NewletterController();
const newletterRouter = Router();

newletterRouter.post('/newletter/add', newletterController.store);
newletterRouter.get('/newletter', newletterController.getAll);

export default newletterRouter;
