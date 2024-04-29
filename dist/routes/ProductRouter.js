"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProductController_1 = __importDefault(require("../admin/controllers/Product/ProductController"));
const express_1 = require("express");
const multer_1 = __importDefault(require("../services/multer"));
const authenToken_1 = __importDefault(require("../middlewares/authenToken"));
const productController = new ProductController_1.default();
const productRouter = (0, express_1.Router)();
productRouter.post('/products/add', multer_1.default.array('product-variant-image', 20), productController.store);
productRouter.post('/products/:id', multer_1.default.array('product-variant-image', 20), productController.update);
productRouter.get('/products', authenToken_1.default, productController.getAll);
productRouter.put('/products', authenToken_1.default, productController.activeProducts);
productRouter.get('/products/:id', authenToken_1.default, productController.getOne);
productRouter.delete('/products/delete/:id', authenToken_1.default, productController.deleteOne);
exports.default = productRouter;
