"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RegisterRouter_1 = __importDefault(require("./RegisterRouter"));
const LoginRouter_1 = __importDefault(require("./LoginRouter"));
const DashboardRouter_1 = __importDefault(require("./DashboardRouter"));
const RefreshTokenRouter_1 = __importDefault(require("./RefreshTokenRouter"));
const LogoutRouter_1 = __importDefault(require("./LogoutRouter"));
function Route(app) {
    app.use('/', RegisterRouter_1.default);
    app.use('/', LoginRouter_1.default);
    app.use('/', DashboardRouter_1.default);
    app.use('/', RefreshTokenRouter_1.default);
    app.use('/', LogoutRouter_1.default);
}
exports.default = Route;
