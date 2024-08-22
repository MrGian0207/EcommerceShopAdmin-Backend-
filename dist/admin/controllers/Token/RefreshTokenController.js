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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../../models/UserModel"));
const UserRefreshTokenModel_1 = __importDefault(require("../../models/UserRefreshTokenModel"));
class RefreshTokenController {
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const RefreshToken = req.cookies.refreshToken;
            const userRefreshToken = yield UserRefreshTokenModel_1.default.findOne({
                refreshToken: RefreshToken,
            });
            const userRole = yield UserModel_1.default.findById(userRefreshToken === null || userRefreshToken === void 0 ? void 0 : userRefreshToken.userId).select('role').exec();
            try {
                if (!userRefreshToken) {
                    res.status(401).json({
                        status: 'Error',
                        message: 'Refresh token is invalid',
                    });
                }
                else {
                    const accessToken = jsonwebtoken_1.default.sign({
                        id: userRefreshToken.userId,
                        role: userRole ? userRole : '',
                    }, process.env.ACCESS_TOKEN_SECRET_KEY, {
                        expiresIn: '2592000s',
                    });
                    res.status(200).json({
                        status: 'success',
                        message: 'New AccessToken was created successfully',
                        accessToken: accessToken,
                    });
                }
            }
            catch (e) {
                res.status(500).json({
                    status: 'Error',
                    message: 'Internal server error',
                });
            }
        });
    }
}
exports.default = RefreshTokenController;
