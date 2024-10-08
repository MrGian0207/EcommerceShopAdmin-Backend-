"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsersController_1 = __importDefault(require("../admin/controllers/Users/UsersController"));
const authenToken_1 = __importDefault(require("../middlewares/authenToken"));
const multer_1 = __importDefault(require("../services/multer"));
const usersController = new UsersController_1.default();
const usersRouter = (0, express_1.Router)();
usersRouter.get('/users', authenToken_1.default, usersController.getAll);
usersRouter.get('/users/:id', authenToken_1.default, usersController.getOne);
usersRouter.put('/users/:id', authenToken_1.default, multer_1.default.single('image'), usersController.update);
exports.default = usersRouter;
