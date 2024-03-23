"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RegisterController_1 = __importDefault(require("../admin/controllers/RegisterController"));
const express_1 = require("express");
const registerController = new RegisterController_1.default();
const registerRouter = (0, express_1.Router)();
registerRouter.post('/auth/register', registerController.store);
exports.default = registerRouter;
