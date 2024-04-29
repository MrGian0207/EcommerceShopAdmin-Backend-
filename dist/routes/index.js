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
const MainCategoriesRouter_1 = __importDefault(require("./MainCategoriesRouter"));
const SubCategoriesRouter_1 = __importDefault(require("./SubCategoriesRouter"));
const BrandsRouter_1 = __importDefault(require("./BrandsRouter"));
const ProductRouter_1 = __importDefault(require("./ProductRouter"));
const OrdersRouter_1 = __importDefault(require("./OrdersRouter"));
const UsersRouter_1 = __importDefault(require("./UsersRouter"));
const NewletterRouter_1 = __importDefault(require("./NewletterRouter"));
const SlideRouter_1 = __importDefault(require("./SlideRouter"));
const SettingsRouter_1 = __importDefault(require("./SettingsRouter"));
const GoogleRouter_1 = __importDefault(require("./GoogleRouter"));
function Route(app) {
    app.use('/', RegisterRouter_1.default);
    app.use('/', LoginRouter_1.default);
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
    app.use('/', GoogleRouter_1.default);
}
exports.default = Route;
