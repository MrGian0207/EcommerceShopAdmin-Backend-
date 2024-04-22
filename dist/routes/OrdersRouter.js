"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OrdersController_1 = __importDefault(require("../admin/controllers/Orders/OrdersController"));
const express_1 = require("express");
const ordersController = new OrdersController_1.default();
const ordersRouter = (0, express_1.Router)();
ordersRouter.post('/orders/add', ordersController.store);
ordersRouter.get('/orders', ordersController.getAll);
ordersRouter.get('/orders/:id', ordersController.getOne);
ordersRouter.delete('/orders/delete/:id', ordersController.deleteOne);
ordersRouter.put('/orders/:id/edit-status', ordersController.updateOne);
exports.default = ordersRouter;
