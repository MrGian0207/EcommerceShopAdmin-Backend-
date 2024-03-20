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
const UserModel_1 = __importDefault(require("../models/UserModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const User = {
    Success: {
        status: 'OK',
        message: 'Registration successful',
    },
    Error: {
        isNotEmail: {
            status: 'Error Email',
            message: 'Email is not valid',
        },
        hasEmail_Existed: {
            status: 'Error Email',
            message: 'Email has already been registered',
        },
        password_notEnoughLength: {
            status: 'Error Password',
            message: 'Password is too short',
        },
        hasPhoneNumber_Existed: {
            status: 'Error Phone Number',
            message: 'Phone Number has already been registered',
        },
    },
};
class RegisterController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullName, gender, emailAddress, phoneNumber, password } = req.body;
            // Clear whitespace
            const FullName = fullName.trim();
            const Email = emailAddress.trim();
            const Password = password.trim();
            // Bcrypt password
            const hashPassword = bcrypt_1.default.hashSync(Password, saltRounds);
            // Check if it's already email address
            const validateEmail = (emailAddress) => {
                return emailAddress.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            };
            // Authentication
            if (!validateEmail(Email)) {
                res.status(406).json(User.Error.isNotEmail);
            }
            else if (Password.length < 8) {
                res.status(406).json(User.Error.password_notEnoughLength);
            }
            else {
                // Authortication
                // Email has already been registered
                const existed_Email = yield UserModel_1.default.findOne({
                    emailAddress: Email,
                });
                // Phone Number has already been registered
                const existed_PhoneNumber = yield UserModel_1.default.findOne({
                    phoneNumber: phoneNumber,
                });
                if (existed_Email) {
                    res.status(406).json(User.Error.hasEmail_Existed);
                }
                else if (existed_PhoneNumber) {
                    res.status(406).json(User.Error.hasPhoneNumber_Existed);
                }
                else {
                    const newUser = new UserModel_1.default({
                        fullName: FullName,
                        gender,
                        phoneNumber,
                        emailAddress: Email,
                        password: hashPassword,
                    });
                    yield newUser
                        .save()
                        .then(() => res.status(200).json(User.Success))
                        .catch((err) => console.log(err));
                }
            }
        });
    }
}
exports.default = RegisterController;
