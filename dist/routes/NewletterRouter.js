"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NewletterController_1 = __importDefault(require("../admin/controllers/Newletter/NewletterController"));
const express_1 = require("express");
const newletterController = new NewletterController_1.default();
const newletterRouter = (0, express_1.Router)();
newletterRouter.post('/newletter/add', newletterController.store);
newletterRouter.get('/newletter', newletterController.getAll);
exports.default = newletterRouter;
