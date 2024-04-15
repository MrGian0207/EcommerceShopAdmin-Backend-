"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BrandsController_1 = __importDefault(require("../admin/controllers/Brands/BrandsController"));
const express_1 = require("express");
const multer_1 = __importDefault(require("../services/multer"));
const brandsController = new BrandsController_1.default();
const brandsRouter = (0, express_1.Router)();
brandsRouter.post('/brands/add', multer_1.default.single('brands-image'), brandsController.store);
brandsRouter.get('/brands', brandsController.getAll);
brandsRouter.get('/brands/name', brandsController.brands);
brandsRouter.get('/brands/:id', brandsController.getOne);
brandsRouter.post('/brands/:id', multer_1.default.single('brands-image'), brandsController.update);
brandsRouter.delete('/brands/delete/:id', brandsController.deleteOne);
exports.default = brandsRouter;
