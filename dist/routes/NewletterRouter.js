"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NewletterController_1 = __importDefault(require("../admin/controllers/Newletter/NewletterController"));
const authenToken_1 = __importDefault(require("../middlewares/authenToken"));
const newletterController = new NewletterController_1.default();
const newletterRouter = (0, express_1.Router)();
newletterRouter.post('/newletter/add', authenToken_1.default, newletterController.store);
newletterRouter.get('/newletter', authenToken_1.default, newletterController.getAll);
exports.default = newletterRouter;
