import OrdersController from '../admin/controllers/Orders/OrdersController';
import { Router } from 'express';

const ordersController = new OrdersController();
const ordersRouter = Router();

ordersRouter.post('/orders/add', ordersController.store);
ordersRouter.get('/orders', ordersController.getAll);
ordersRouter.get('/orders/:id', ordersController.getOne);
ordersRouter.delete('/orders/delete/:id', ordersController.deleteOne);
ordersRouter.put('/orders/:id/edit-status', ordersController.updateOne);

export default ordersRouter;
