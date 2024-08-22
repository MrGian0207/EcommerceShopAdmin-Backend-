"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrdersController_1 = __importDefault(require("../admin/controllers/Orders/OrdersController"));
const authenToken_1 = __importDefault(require("../middlewares/authenToken"));
const ordersController = new OrdersController_1.default();
const ordersRouter = (0, express_1.Router)();
ordersRouter.post('/orders/add', authenToken_1.default, ordersController.store);
ordersRouter.get('/orders', authenToken_1.default, ordersController.getAll);
ordersRouter.get('/orders/:id', authenToken_1.default, ordersController.getOne);
ordersRouter.delete('/orders/delete/:id', authenToken_1.default, ordersController.deleteOne);
ordersRouter.put('/orders/:id/edit-status', authenToken_1.default, ordersController.updateOne);
exports.default = ordersRouter;
