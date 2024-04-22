"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UsersController_1 = __importDefault(require("../admin/controllers/Users/UsersController"));
const express_1 = require("express");
const usersController = new UsersController_1.default();
const usersRouter = (0, express_1.Router)();
usersRouter.get('/users', usersController.getAll);
usersRouter.get('/users/:id', usersController.getOne);
exports.default = usersRouter;
