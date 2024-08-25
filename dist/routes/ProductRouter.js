"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = __importDefault(require("../admin/controllers/Product/ProductController"));
const authenToken_1 = __importDefault(require("../middlewares/authenToken"));
const multer_1 = __importDefault(require("../services/multer"));
const productController = new ProductController_1.default();
const productRouter = (0, express_1.Router)();
productRouter.post('/product/add', multer_1.default.array('variantImages', 20), productController.store);
productRouter.post('/product/:id', multer_1.default.array('variantImages', 20), productController.update);
productRouter.get('/product', authenToken_1.default, productController.getAll);
productRouter.put('/product/:id', authenToken_1.default, productController.activeProducts);
productRouter.get('/product/:id', authenToken_1.default, productController.getOne);
productRouter.delete('/product/delete/:id', authenToken_1.default, productController.deleteOne);
exports.default = productRouter;
