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
const cloudinary_1 = __importDefault(require("../../../utils/cloudinary"));
const UserModel_1 = __importDefault(require("../../models/UserModel"));
class UsersController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const page = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) ? (_b = req.query) === null || _b === void 0 ? void 0 : _b.page : '1';
                const brandsPerPage = 10;
                const search = (_c = req.query) === null || _c === void 0 ? void 0 : _c.search;
                let numberOfUsers = 0;
                yield UserModel_1.default.countDocuments({}).then((countDocuments) => {
                    numberOfUsers = Math.ceil(countDocuments / brandsPerPage);
                });
                yield UserModel_1.default.find({
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { emailAddress: { $regex: search, $options: 'i' } },
                        { phone: { $regex: search, $options: 'i' } },
                    ],
                })
                    .skip((parseInt(page) - 1) * brandsPerPage)
                    .limit(brandsPerPage)
                    .then((users) => {
                    return res.status(200).json({ data: users, numbers: numberOfUsers });
                });
            }
            catch (error) {
                console.log(error);
                return res.status(404).json({
                    status: 'Error',
                    message: 'Users have not been found',
                });
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                UserModel_1.default.findOne({ _id: id })
                    .then((user) => {
                    res.status(200).json(user);
                })
                    .catch((error) => {
                    res.status(404).json({
                        status: 'Error',
                        message: error.message,
                    });
                });
            }
            catch (error) {
                console.log(error);
                res.status(404).json({
                    status: 'Error',
                    message: 'User have not been found',
                });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, email, phone, gender, about } = req.body;
                const image = req.file;
                console.log(Object.assign(Object.assign({ id }, req.body), { image }));
                // res.status(200).json({ message: 'ok' });
                yield UserModel_1.default.findById(id).then((user) => __awaiter(this, void 0, void 0, function* () {
                    if (image) {
                        yield cloudinary_1.default.uploader
                            .upload(image.path, {
                            folder: 'users',
                        })
                            .then((imageUrl) => __awaiter(this, void 0, void 0, function* () {
                            if (user) {
                                user.name = name;
                                user.email = email;
                                user.phone = phone;
                                user.gender = gender;
                                user.about = about;
                                user.image = imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.secure_url;
                                yield user.save().then(() => {
                                    return res.status(200).json({
                                        status: 'Success',
                                        message: 'User have been updated successfully !!!',
                                    });
                                });
                            }
                        }))
                            .catch((error) => {
                            return res.status(404).json({
                                status: 'Error',
                                message: 'User have not been updated',
                            });
                        });
                    }
                    else {
                        if (user) {
                            user.name = name;
                            user.email = email;
                            user.phone = phone;
                            user.gender = gender;
                            user.about = about;
                            yield user.save().then(() => {
                                return res.status(200).json({
                                    status: 'Success',
                                    message: 'User have been updated successfully !!!',
                                });
                            });
                        }
                    }
                }));
            }
            catch (error) {
                return res.status(404).json({
                    status: 'Error',
                    message: 'User have not been updated',
                });
            }
        });
    }
}
exports.default = UsersController;
