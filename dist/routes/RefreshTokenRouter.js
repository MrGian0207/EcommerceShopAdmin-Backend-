"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RefreshTokenController_1 = __importDefault(require("../admin/controllers/Token/RefreshTokenController"));
const express_1 = require("express");
const refreshTokenController = new RefreshTokenController_1.default();
const refreshTokenRouter = (0, express_1.Router)();
refreshTokenRouter.post('/refreshToken', refreshTokenController.refreshToken);
exports.default = refreshTokenRouter;
