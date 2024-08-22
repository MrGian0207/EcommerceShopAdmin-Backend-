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
const email_1 = __importDefault(require("../../../services/email"));
const UserModel_1 = __importDefault(require("../../models/UserModel"));
const saltRounds = 10;
function generateRandomString(length = 12) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }
    return randomString;
}
class ForgotPasswordController {
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            console.log(email);
            const newPassword = generateRandomString();
            const hashPassword = yield bcrypt_1.default.hash(newPassword, saltRounds);
            yield UserModel_1.default.findOneAndUpdate({ email: email }, { $set: { password: hashPassword } }).then((user) => __awaiter(this, void 0, void 0, function* () {
                if (user) {
                    yield (0, email_1.default)(res, next, `${email}`, 'Reset Password', 'anotherMessage', {
                        accessCode: `${newPassword}`,
                    });
                    res.status(200).json({
                        message: 'New password has been sent to your email address! Please check your password',
                    });
                }
                else {
                    res.status(404).json({
                        message: 'Email not found',
                    });
                }
            }));
        });
    }
}
exports.default = ForgotPasswordController;
