"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BrandsRouter_1 = __importDefault(require("./BrandsRouter"));
const DashboardRouter_1 = __importDefault(require("./DashboardRouter"));
const ForgotPasswordRouter_1 = __importDefault(require("./ForgotPasswordRouter"));
const LoginRouter_1 = __importDefault(require("./LoginRouter"));
const LogoutRouter_1 = __importDefault(require("./LogoutRouter"));
const MainCategoriesRouter_1 = __importDefault(require("./MainCategoriesRouter"));
const NewletterRouter_1 = __importDefault(require("./NewletterRouter"));
const OrdersRouter_1 = __importDefault(require("./OrdersRouter"));
const ProductRouter_1 = __importDefault(require("./ProductRouter"));
const RefreshTokenRouter_1 = __importDefault(require("./RefreshTokenRouter"));
const RegisterRouter_1 = __importDefault(require("./RegisterRouter"));
const SettingsRouter_1 = __importDefault(require("./SettingsRouter"));
const SlideRouter_1 = __importDefault(require("./SlideRouter"));
const SubCategoriesRouter_1 = __importDefault(require("./SubCategoriesRouter"));
const UsersRouter_1 = __importDefault(require("./UsersRouter"));
const indexRouter = (0, express_1.Router)();
indexRouter.get('/', (req, res) => {
    res.json({
        message: 'This is the Ecommerce shop backend',
    });
});
// ROUTE
function Route(app) {
    app.use('/', indexRouter);
    app.use('/', RegisterRouter_1.default);
    app.use('/', LoginRouter_1.default);
    app.use('/', ForgotPasswordRouter_1.default);
    app.use('/', DashboardRouter_1.default);
    app.use('/', RefreshTokenRouter_1.default);
    app.use('/', LogoutRouter_1.default);
    app.use('/', MainCategoriesRouter_1.default);
    app.use('/', SubCategoriesRouter_1.default);
    app.use('/', BrandsRouter_1.default);
    app.use('/', ProductRouter_1.default);
    app.use('/', OrdersRouter_1.default);
    app.use('/', UsersRouter_1.default);
    app.use('/', NewletterRouter_1.default);
    app.use('/', SlideRouter_1.default);
    app.use('/', SettingsRouter_1.default);
}
exports.default = Route;
