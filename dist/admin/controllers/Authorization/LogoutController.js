"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRefreshTokenModel_1 = __importDefault(require("../../models/UserRefreshTokenModel"));
class LogoutController {
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const RefreshToken = req.cookies.refreshToken;
            console.log(RefreshToken);
            const userRefreshToken = yield UserRefreshTokenModel_1.default.findOne({
                refreshToken: RefreshToken,
            });
            console.log(userRefreshToken);
            if (userRefreshToken) {
                yield UserRefreshTokenModel_1.default.deleteOne({
                    refreshToken: RefreshToken,
                });
                res.clearCookie('refreshToken', { httpOnly: true });
                res
                    .status(200)
                    .json({ status: 'Success', message: 'Logout successfully' });
            }
            else {
                res.status(400).json({
                    status: 'Error',
                    message: 'RefreshToken Not Exitsted',
                });
            }
        });
    }
}
exports.default = LogoutController;
