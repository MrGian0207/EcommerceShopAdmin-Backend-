"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UsersController_1 = __importDefault(require("../admin/controllers/Users/UsersController"));
const express_1 = require("express");
const multer_1 = __importDefault(require("../services/multer"));
const usersController = new UsersController_1.default();
const usersRouter = (0, express_1.Router)();
usersRouter.get('/users', usersController.getAll);
usersRouter.get('/users/:id', usersController.getOne);
usersRouter.put('/users', multer_1.default.single('users-image'), usersController.update);
exports.default = usersRouter;
