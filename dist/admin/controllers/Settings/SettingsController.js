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
const saltRounds = 10;
class SettingsController {
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const page = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) ? (_b = req.query) === null || _b === void 0 ? void 0 : _b.page : '1';
                const brandsPerPage = 10;
                let numberOfUsers = 0;
                yield UserModel_1.default.countDocuments({}).then((countDocuments) => {
                    numberOfUsers = Math.ceil(countDocuments / brandsPerPage);
                });
                yield UserModel_1.default.find()
                    .skip((parseInt(page) - 1) * brandsPerPage)
                    .limit(brandsPerPage)
                    .then((users) => {
                    return res.status(200).json({ data: users, numbers: numberOfUsers });
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
            const { name, gender, email, phone, password, role } = req.body;
            try {
                const hashPassword = bcrypt_1.default.hashSync(password, saltRounds);
                yield UserModel_1.default.findOne({ email }).then((user) => __awaiter(this, void 0, void 0, function* () {
                    if (user === null || user === void 0 ? void 0 : user.role) {
                        user.role = role;
                        yield user.save().then(() => {
                            return res.status(200).json({
                                status: 'Success',
                                message: 'User updated successfully',
                            });
                        });
                    }
                    if (!user) {
                        const newUser = new UserModel_1.default({
                            name,
                            gender,
                            phone,
                            email,
                            statusUser: 'Not-verified',
                            role: role,
                            password: hashPassword,
                        });
                        yield newUser.save().then(() => {
                            return res.status(200).json({
                                status: 'Success',
                                message: 'User added successfully',
                            });
                        });
                    }
                }));
            }
            catch (err) {
                return res.status(500).json({
                    status: 'Error',
                    message: 'Could not add User',
                });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { oldPassword, newPassword, id } = req.body;
                yield UserModel_1.default.findOne({ _id: id }).then((user) => __awaiter(this, void 0, void 0, function* () {
                    if (user) {
                        const ValidatePassword = bcrypt_1.default.compareSync(oldPassword, user.password);
                        if (ValidatePassword) {
                            const hashPassword = bcrypt_1.default.hashSync(String(newPassword).trim(), saltRounds);
                            yield UserModel_1.default.findOneAndUpdate({ _id: id }, {
                                password: hashPassword,
                            }).then((user) => {
                                if (!user) {
                                    return res.status(404).json({
                                        status: 'Error',
                                        message: 'User not updated',
                                    });
                                }
                                return res.status(200).json({
                                    status: 'Success',
                                    message: 'Password changed successfully',
                                });
                            });
                        }
                        else {
                            return res.status(401).json({
                                status: 'Error',
                                message: 'Old password is incorrect',
                            });
                        }
                    }
                    if (!user) {
                        return res.status(404).json({
                            status: 'Error',
                            message: 'User not found',
                        });
                    }
                }));
            }
            catch (error) {
                return res.status(500).json({
                    status: 'Error',
                    message: 'Internal server error',
                });
            }
        });
    }
}
exports.default = SettingsController;
