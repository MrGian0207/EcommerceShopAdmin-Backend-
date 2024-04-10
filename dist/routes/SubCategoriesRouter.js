"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SubCategoriesController_1 = __importDefault(require("../admin/controllers/Categories/SubCategoriesController"));
const express_1 = require("express");
const multer_1 = __importDefault(require("../services/multer"));
const subCategoriesController = new SubCategoriesController_1.default();
const subCategoriesRouter = (0, express_1.Router)();
subCategoriesRouter.post('/categories/sub-categories/add', multer_1.default.single('sub-category-image'), subCategoriesController.store);
subCategoriesRouter.get('/categories/sub-categories', subCategoriesController.getAll);
subCategoriesRouter.get('/categories/sub-categories/:id', subCategoriesController.getOne);
subCategoriesRouter.post('/categories/sub-categories/:id', multer_1.default.single('sub-category-image'), subCategoriesController.update);
exports.default = subCategoriesRouter;
