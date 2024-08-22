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
const UserModel_1 = __importDefault(require("../../models/UserModel"));
class RegisterController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 10;
            let { name, gender, email, phone, password } = req.body;
            name = name.trim();
            gender = gender.trim();
            email = email.trim();
            phone = phone.trim();
            password = password.trim();
            // Bcrypt password
            const hashPassword = bcrypt_1.default.hashSync(password, saltRounds);
            yield UserModel_1.default.findOne({
                $or: [{ emailAddress: email }, { phoneNumber: phone }],
            })
                .then((existed_User) => {
                if (!existed_User) {
                    const newUser = new UserModel_1.default({
                        name,
                        gender,
                        phone,
                        email,
                        statusUser: 'Not-verified',
                        role: 'Staff',
                        password: hashPassword,
                    });
                    newUser
                        .save()
                        .then(() => res.status(200).json({ message: 'Registration successful' }))
                        .catch((err) => {
                        console.log(err);
                        return res.status(400).json({ message: 'Registration failed' });
                    });
                }
            })
                .catch((_) => res.status(500).json({
                message: 'User not found',
            }));
        });
    }
}
exports.default = RegisterController;
