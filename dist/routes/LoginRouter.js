"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginController_1 = __importDefault(require("../admin/controllers/LoginController"));
const express_1 = require("express");
const loginController = new LoginController_1.default();
const loginRouter = (0, express_1.Router)();
loginRouter.post('/login', loginController.login);
exports.default = loginRouter;
