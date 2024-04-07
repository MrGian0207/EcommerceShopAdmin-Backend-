"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AddMainCategoriesController_1 = __importDefault(require("../admin/controllers/AddMainCategoriesController"));
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
const addMainCategoriesController = new AddMainCategoriesController_1.default();
const addMainCategoriesRouter = (0, express_1.Router)();
addMainCategoriesRouter.post('/categories/main-categories/add', upload.single('category-image'), addMainCategoriesController.store);
exports.default = addMainCategoriesRouter;
