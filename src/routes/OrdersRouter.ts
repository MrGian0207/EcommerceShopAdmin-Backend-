import { Router } from 'express'

import OrdersController from '../admin/controllers/Orders/OrdersController'
import authenToken from '../middlewares/authenToken'

const ordersController = new OrdersController()
const ordersRouter = Router()

ordersRouter.post('/orders/add', authenToken, ordersController.store)
ordersRouter.get('/orders', authenToken, ordersController.getAll)
ordersRouter.get('/orders/:id', authenToken, ordersController.getOne)
ordersRouter.delete('/orders/delete/:id', authenToken, ordersController.deleteOne)
ordersRouter.put('/orders/:id/edit-status', authenToken, ordersController.updateOne)

export default ordersRouter
