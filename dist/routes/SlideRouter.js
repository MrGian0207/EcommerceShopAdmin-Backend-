"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SlideController_1 = __importDefault(require("../admin/controllers/Slide/SlideController"));
const express_1 = require("express");
const multer_1 = __importDefault(require("../services/multer"));
const slideController = new SlideController_1.default();
const slideRouter = (0, express_1.Router)();
slideRouter.post('/slides/add', multer_1.default.single('slide-image'), slideController.store);
slideRouter.get('/slides', slideController.getAll);
exports.default = slideRouter;
