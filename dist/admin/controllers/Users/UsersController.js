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
const cloudinary_1 = __importDefault(require("../../../utils/cloudinary"));
class UsersController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const page = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page)
                    ? (_b = req.query) === null || _b === void 0 ? void 0 : _b.page
                    : '1';
                const brandsPerPage = 10;
                const search = (_c = req.query) === null || _c === void 0 ? void 0 : _c.search;
                let numberOfUsers = 0;
                yield UserModel_1.default.countDocuments({}).then((countDocuments) => {
                    numberOfUsers = Math.ceil(countDocuments / brandsPerPage);
                });
                const users = yield UserModel_1.default.find({
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { emailAddress: { $regex: search, $options: 'i' } },
                        { phone: { $regex: search, $options: 'i' } },
                    ],
                })
                    .skip((parseInt(page) - 1) * brandsPerPage)
                    .limit(brandsPerPage);
                return res.status(200).json({
                    status: 'Success',
                    data: users,
                    numbers: numberOfUsers,
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
                const user = yield UserModel_1.default.findOne({ _id: id });
                if (user) {
                    res.status(200).json({
                        status: 'Success',
                        data: user,
                    });
                }
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
                const { id, name, emailAddress, phone, gender, about } = req.body;
                const image = req.file;
                const user = yield UserModel_1.default.findById(id);
                if (image && !(user === null || user === void 0 ? void 0 : user.image)) {
                    const imageUrl = yield cloudinary_1.default.uploader.upload(image.path, {
                        folder: 'users',
                    });
                    // Kiểm tra nếu hình ảnh không tải lên thành công
                    if (!imageUrl || !imageUrl.secure_url) {
                        return res.status(400).json({
                            status: 'Error',
                            message: 'Failed to upload image',
                        });
                    }
                    if (user) {
                        user.image = imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.secure_url;
                    }
                    user === null || user === void 0 ? void 0 : user.save();
                }
                else if (image && (user === null || user === void 0 ? void 0 : user.image) !== undefined) {
                    const deletedImage = user === null || user === void 0 ? void 0 : user.image;
                    const publicIdRegex = /\/users\/([^/.]+)/;
                    const matches = deletedImage.match(publicIdRegex);
                    yield cloudinary_1.default.uploader.destroy(`users/${matches && matches[1]}`, (error, result) => {
                        if (error) {
                            console.error('Failed to delete image:', error);
                            // Xử lý lỗi
                        }
                        else {
                            console.log('Image deleted successfully:', result);
                            // Xử lý khi xóa thành công
                        }
                    });
                    const imageUrl = yield cloudinary_1.default.uploader.upload(image.path, {
                        folder: 'users',
                    });
                    if (!imageUrl || !imageUrl.secure_url) {
                        return res.status(400).json({
                            status: 'Error',
                            message: 'Failed to upload image',
                        });
                    }
                    if (user) {
                        user.fullName = name;
                        user.emailAddress = emailAddress;
                        user.phoneNumber = phone;
                        user.gender = gender;
                        user.about = about;
                        user.image = imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.secure_url;
                    }
                    user === null || user === void 0 ? void 0 : user.save();
                }
                else {
                    if (user) {
                        user.fullName = name;
                        user.emailAddress = emailAddress;
                        user.phoneNumber = phone;
                        user.gender = gender;
                        user.about = about;
                    }
                    user === null || user === void 0 ? void 0 : user.save();
                }
                return res.status(200).json({
                    status: 'Success',
                    message: 'User have been updated successfully !!!',
                });
            }
            catch (error) {
                console.log(error);
                return res.status(404).json({
                    status: 'Error',
                    message: 'User have not been updated',
                });
            }
        });
    }
}
exports.default = UsersController;
