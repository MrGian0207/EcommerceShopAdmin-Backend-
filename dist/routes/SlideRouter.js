"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SlideController_1 = __importDefault(require("../admin/controllers/Slide/SlideController"));
const authenToken_1 = __importDefault(require("../middlewares/authenToken"));
const multer_1 = __importDefault(require("../services/multer"));
const slideController = new SlideController_1.default();
const slideRouter = (0, express_1.Router)();
slideRouter.post('/slides/add', authenToken_1.default, multer_1.default.single('image'), slideController.store);
slideRouter.get('/slides', authenToken_1.default, slideController.getAll);
slideRouter.get('/slides/:id', authenToken_1.default, slideController.getOne);
slideRouter.post('/slides/:id', authenToken_1.default, multer_1.default.single('image'), slideController.update);
slideRouter.delete('/slides/delete/:id', authenToken_1.default, slideController.deleteOne);
exports.default = slideRouter;
