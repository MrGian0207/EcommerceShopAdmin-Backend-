"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SettingsController_1 = __importDefault(require("../admin/controllers/Settings/SettingsController"));
const authenToken_1 = __importDefault(require("../middlewares/authenToken"));
const settingsController = new SettingsController_1.default();
const settingsRouter = (0, express_1.Router)();
settingsRouter.get('/settings', authenToken_1.default, settingsController.getUser);
settingsRouter.post('/settings/addRole', authenToken_1.default, settingsController.addUserWithRole);
settingsRouter.put('/settings/update-password', authenToken_1.default, settingsController.changePassword);
exports.default = settingsRouter;
