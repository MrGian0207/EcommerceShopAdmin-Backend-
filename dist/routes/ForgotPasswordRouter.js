"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ForgotPasswordController_1 = __importDefault(require("../admin/controllers/Authorization/ForgotPasswordController"));
const forgotPasswordController = new ForgotPasswordController_1.default();
const forgotPasswordRouter = (0, express_1.Router)();
forgotPasswordRouter.post('/auth/forgot-password', forgotPasswordController.forgotPassword);
exports.default = forgotPasswordRouter;
