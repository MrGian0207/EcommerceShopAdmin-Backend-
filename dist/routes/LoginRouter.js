"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LoginController_1 = __importDefault(require("../admin/controllers/Authorization/LoginController"));
const loginController = new LoginController_1.default();
const loginRouter = (0, express_1.Router)();
loginRouter.post('/auth/login', loginController.login);
loginRouter.get('/index', loginController.index);
exports.default = loginRouter;
