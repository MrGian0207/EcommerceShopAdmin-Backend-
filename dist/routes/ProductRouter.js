"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProductController_1 = __importDefault(require("../admin/controllers/Product/ProductController"));
const express_1 = require("express");
const multer_1 = __importDefault(require("../services/multer"));
const productController = new ProductController_1.default();
const productRouter = (0, express_1.Router)();
productRouter.post('/products/add', multer_1.default.array('product-variant-image', 20), productController.store);
productRouter.post('/products/:id', multer_1.default.array('product-variant-image', 20), productController.update);
productRouter.get('/products', productController.getAll);
productRouter.put('/products', productController.activeProducts);
productRouter.get('/products/:id', productController.getOne);
exports.default = productRouter;
