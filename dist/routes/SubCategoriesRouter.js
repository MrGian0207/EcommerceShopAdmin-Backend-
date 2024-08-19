"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SubCategoriesController_1 = __importDefault(require("../admin/controllers/Categories/SubCategoriesController"));
const express_1 = require("express");
const multer_1 = __importDefault(require("../services/multer"));
const authenToken_1 = __importDefault(require("../middlewares/authenToken"));
const subCategoriesController = new SubCategoriesController_1.default();
const subCategoriesRouter = (0, express_1.Router)();
subCategoriesRouter.post('/categories/sub-categories/add', authenToken_1.default, multer_1.default.single('image'), subCategoriesController.store);
subCategoriesRouter.get('/categories/sub-categories', authenToken_1.default, subCategoriesController.getAll);
subCategoriesRouter.get('/categories/sub-categories/name', authenToken_1.default, subCategoriesController.subCategories);
subCategoriesRouter.get('/categories/sub-categories/:id', authenToken_1.default, subCategoriesController.getOne);
subCategoriesRouter.post('/categories/sub-categories/:id', authenToken_1.default, multer_1.default.single('image'), subCategoriesController.update);
subCategoriesRouter.delete('/categories/sub-categories/delete/:id', authenToken_1.default, subCategoriesController.deleteOne);
exports.default = subCategoriesRouter;
