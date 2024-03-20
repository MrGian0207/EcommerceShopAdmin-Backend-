"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LogoutController_1 = __importDefault(require("../admin/controllers/LogoutController"));
const express_1 = require("express");
const logoutController = new LogoutController_1.default();
const logoutRouter = (0, express_1.Router)();
logoutRouter.post('/logout', logoutController.logout);
exports.default = logoutRouter;
