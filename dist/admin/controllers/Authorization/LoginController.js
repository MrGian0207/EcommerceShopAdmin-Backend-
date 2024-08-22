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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../../models/UserModel"));
const UserRefreshTokenModel_1 = __importDefault(require("../../models/UserRefreshTokenModel"));
class LoginController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { email, password } = req.body;
            email = email.trim();
            password = password.trim();
            //JsonWebToken
            const accessToken = jsonwebtoken_1.default.sign({ email, password }, process.env.ACCESS_TOKEN_SECRET_KEY, {
                expiresIn: '2592000s',
            });
            const refreshToken = jsonwebtoken_1.default.sign({ email, password }, process.env.REFRESH_TOKEN_SECRET_KEY);
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 365);
            const existed_User = yield UserModel_1.default.findOne({
                email,
            });
            if (existed_User) {
                // Kiểm tra password chỉ khi existed_User tồn tại
                const ValidatePassword = bcrypt_1.default.compareSync(password, existed_User.password);
                if (ValidatePassword) {
                    const newUserRefreshToken = new UserRefreshTokenModel_1.default({
                        userId: existed_User.id,
                        refreshToken: refreshToken,
                        createdAt: Date.now(),
                    });
                    yield newUserRefreshToken.save();
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: true,
                        path: '/',
                        sameSite: 'none',
                        expires: currentDate,
                    });
                    res.status(200).json({
                        message: 'Login successful',
                        accessToken,
                        idUser: existed_User._id,
                    });
                }
                else {
                    res.status(406).json({ message: 'Password is incorrect' });
                }
            }
            else {
                res.status(406).json({
                    message: 'Email has not already been registered',
                });
            }
        });
    }
    index(req, res) {
        res.status(200).json({
            status: 'Success',
        });
    }
}
exports.default = LoginController;
