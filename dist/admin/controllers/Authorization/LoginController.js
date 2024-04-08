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
const UserModel_1 = __importDefault(require("../../models/UserModel"));
const UserRefreshTokenModel_1 = __importDefault(require("../../models/UserRefreshTokenModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const User = {
    Success: {
        status: 'OK',
        message: 'Login successful',
    },
    Error: {
        Email_isNotRegisterd: {
            status: 'Error Email',
            message: 'Email has not already been registered',
        },
        Password_Incorrect: {
            status: 'Error Password',
            message: 'Password is incorrect',
        },
    },
};
class LoginController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { emailAddress, password } = req.body;
            const data = req.body;
            //JsonWebToken
            const accessToken = jsonwebtoken_1.default.sign(data, process.env.ACCESS_TOKEN_SECRET_KEY, {
                expiresIn: '30s',
            });
            const refreshToken = jsonwebtoken_1.default.sign(data, process.env.REFRESH_TOKEN_SECRET_KEY);
            //Clear whitespace
            const Email = emailAddress ? emailAddress.trim() : '';
            const Password = password ? password === null || password === void 0 ? void 0 : password.trim() : '';
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 365);
            const existed_User = yield UserModel_1.default.findOne({
                emailAddress: Email,
            });
            if (existed_User) {
                // Kiểm tra password chỉ khi existed_User tồn tại
                const ValidatePassword = yield bcrypt_1.default.compareSync(Password, existed_User.password);
                if (ValidatePassword) {
                    const newUserRefreshToken = new UserRefreshTokenModel_1.default({
                        userId: existed_User.id,
                        refreshToken: refreshToken,
                        createdAt: Date.now(),
                    });
                    yield newUserRefreshToken.save();
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: false,
                        path: '/',
                        sameSite: 'strict',
                        expires: currentDate,
                    });
                    res.status(200).json({ response: User.Success, accessToken });
                }
                else {
                    res.status(406).json(User.Error.Password_Incorrect);
                }
            }
            else {
                res.status(406).json(User.Error.Email_isNotRegisterd);
            }
        });
    }
    index(req, res) {
        const RefreshToken = req.cookies.refreshToken;
        res.send(RefreshToken);
    }
}
exports.default = LoginController;
