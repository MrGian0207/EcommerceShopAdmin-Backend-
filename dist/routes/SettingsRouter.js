"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SettingsController_1 = __importDefault(require("../admin/controllers/Settings/SettingsController"));
const express_1 = require("express");
const settingsController = new SettingsController_1.default();
const settingsRouter = (0, express_1.Router)();
settingsRouter.get('/settings', settingsController.getUser);
settingsRouter.post('/settings', settingsController.addUserWithRole);
settingsRouter.put('/settings/update-password', settingsController.changePassword);
exports.default = settingsRouter;
