"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DashboardController_1 = __importDefault(require("../admin/controllers/Dashboard/DashboardController"));
const authenToken_1 = __importDefault(require("../middlewares/authenToken"));
const dashboardController = new DashboardController_1.default();
const dashboardRouter = (0, express_1.Router)();
dashboardRouter.get('/dashboard', authenToken_1.default, dashboardController.index);
exports.default = dashboardRouter;
