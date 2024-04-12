"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Brands_1 = __importDefault(require("../admin/controllers/Brands/Brands"));
const express_1 = require("express");
const multer_1 = __importDefault(require("../services/multer"));
const brandsController = new Brands_1.default();
const brandsRouter = (0, express_1.Router)();
brandsRouter.post('/brands/add', multer_1.default.single('brands-image'), brandsController.store);
brandsRouter.get('/brands', brandsController.getAll);
brandsRouter.get('/brands/:id', brandsController.getOne);
brandsRouter.post('/brands/:id', multer_1.default.single('brands-image'), brandsController.update);
brandsRouter.delete('/brands/delete/:id', brandsController.deleteOne);
exports.default = brandsRouter;
