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
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
class SettingsController {
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const page = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page)
                    ? (_b = req.query) === null || _b === void 0 ? void 0 : _b.page
                    : '1';
                const brandsPerPage = 10;
                let numberOfUsers = 0;
                yield UserModel_1.default.countDocuments({}).then((countDocuments) => {
                    numberOfUsers = Math.ceil(countDocuments / brandsPerPage);
                });
                const user = yield UserModel_1.default.find()
                    .skip((parseInt(page) - 1) * brandsPerPage)
                    .limit(brandsPerPage);
                return res.status(200).json({
                    status: 'Success',
                    data: user,
                    numbers: numberOfUsers,
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: 'Error',
                    message: 'Could not find User',
                });
            }
        });
    }
    addUserWithRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fullName, gender, emailAddress, phoneNumber, password, role } = req.body;
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
                    res.status(406).json({
                        status: 'Error',
                        message: 'Email is not valid',
                    });
                }
                else if (Password && Password.length < 8) {
                    res.status(406).json({
                        status: 'Error',
                        message: 'Password must be at least 8 characters',
                    });
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
                        if (role) {
                            const user = (yield UserModel_1.default.findOneAndUpdate({ emailAddress }, {
                                role: role,
                            }));
                            if (user) {
                                return res.status(200).json({
                                    status: 'Succes',
                                    message: 'Role Updated successfully',
                                });
                            }
                            else {
                                return res.status(404).json({
                                    status: 'Error',
                                    message: 'User not found',
                                });
                            }
                        }
                        else {
                            res.status(406).json({
                                status: 'Error',
                                message: 'Email has already been registered',
                            });
                        }
                    }
                    else if (existed_PhoneNumber) {
                        res.status(406).json({
                            status: 'Error',
                            message: 'Phone Number has already been registered',
                        });
                    }
                    else {
                        const newUser = new UserModel_1.default({
                            fullName: FullName,
                            gender,
                            phoneNumber,
                            emailAddress: Email,
                            status: 'Not-verified',
                            role: role,
                            password: hashPassword,
                        });
                        yield newUser
                            .save()
                            .then(() => res.status(200).json({
                            status: 'Success',
                            message: 'User have been added successfully !!!',
                        }))
                            .catch((err) => console.log(err));
                    }
                }
            }
            catch (error) { }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { oldPassword, newPassword, confirmNewPassword, id } = req.body;
                // Clear whitespace
                const OldPassword = oldPassword === null || oldPassword === void 0 ? void 0 : oldPassword.trim();
                const NewPassword = newPassword === null || newPassword === void 0 ? void 0 : newPassword.trim();
                const ConfirmNewPassword = confirmNewPassword === null || confirmNewPassword === void 0 ? void 0 : confirmNewPassword.trim();
                console.log(req.body);
                console.log({ OldPassword, NewPassword, ConfirmNewPassword });
                if (!oldPassword || !newPassword || !confirmNewPassword) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Missing required fields',
                    });
                }
                const user = (yield UserModel_1.default.findOne({ _id: id }));
                console.log(user);
                const ValidatePassword = yield bcrypt_1.default.compareSync(OldPassword, user.password);
                if (ValidatePassword) {
                    if (NewPassword === ConfirmNewPassword) {
                        const hashPassword = bcrypt_1.default.hashSync(NewPassword, saltRounds);
                        const user = yield UserModel_1.default.findOneAndUpdate({ _id: id }, {
                            password: hashPassword,
                        });
                        if (user) {
                            return res.status(200).json({
                                status: 'Success',
                                message: 'Password changed successfully',
                            });
                        }
                        else {
                            return res.status(404).json({
                                status: 'Error',
                                message: 'User not updated',
                            });
                        }
                    }
                    else {
                        return res.status(400).json({
                            status: 'Error',
                            message: 'New password and confirm new password do not match',
                        });
                    }
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    status: 'Error',
                    message: 'Internal server error',
                });
            }
        });
    }
}
exports.default = SettingsController;
