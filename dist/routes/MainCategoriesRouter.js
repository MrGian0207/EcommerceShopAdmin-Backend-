"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MainCategoriesController_1 = __importDefault(require("../admin/controllers/Categories/MainCategoriesController"));
const express_1 = require("express");
const multer_1 = __importDefault(require("../services/multer"));
const authenToken_1 = __importDefault(require("../middlewares/authenToken"));
const mainCategoriesController = new MainCategoriesController_1.default();
const mainCategoriesRouter = (0, express_1.Router)();
mainCategoriesRouter.post('/categories/main-categories/add', authenToken_1.default, multer_1.default.single('image'), mainCategoriesController.store);
mainCategoriesRouter.get('/categories/main-categories', authenToken_1.default, mainCategoriesController.getAll);
mainCategoriesRouter.get('/categories/main-categories/name', authenToken_1.default, mainCategoriesController.categories);
mainCategoriesRouter.get('/categories/main-categories/:id', authenToken_1.default, mainCategoriesController.getOne);
mainCategoriesRouter.post('/categories/main-categories/:id', authenToken_1.default, multer_1.default.single('image'), mainCategoriesController.update);
mainCategoriesRouter.delete('/categories/main-categories/delete/:id', authenToken_1.default, mainCategoriesController.deleteOne);
exports.default = mainCategoriesRouter;
