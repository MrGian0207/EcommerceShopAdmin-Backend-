"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MainCategoriesController_1 = __importDefault(require("../admin/controllers/Categories/MainCategoriesController"));
const express_1 = require("express");
const multer_1 = __importDefault(require("../services/multer"));
const mainCategoriesController = new MainCategoriesController_1.default();
const mainCategoriesRouter = (0, express_1.Router)();
mainCategoriesRouter.post('/categories/main-categories/add', multer_1.default.single('category-image'), mainCategoriesController.store);
mainCategoriesRouter.get('/categories/main-categories', mainCategoriesController.getAll);
mainCategoriesRouter.get('/categories/main-categories/:id', mainCategoriesController.getOne);
mainCategoriesRouter.post('/categories/main-categories/:id', multer_1.default.single('category-image'), mainCategoriesController.update);
exports.default = mainCategoriesRouter;
