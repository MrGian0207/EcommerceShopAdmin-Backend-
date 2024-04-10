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
const MainCategoriesModel_1 = __importDefault(require("../../models/MainCategoriesModel"));
class AddMainCategoriesController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, title, slug, description } = req.body;
                const image = req.file;
                // Kiểm tra các trường bắt buộc
                if (!name || !title || !slug || !description || !image) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Missing required fields',
                    });
                }
                // Tải lên hình ảnh lên Cloudinary
                const imageUrl = yield cloudinary_1.default.uploader.upload(image.path, {
                    folder: 'mainCategories',
                });
                // Kiểm tra nếu hình ảnh không tải lên thành công
                if (!imageUrl || !imageUrl.secure_url) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Failed to upload image',
                    });
                }
                // Tạo đối tượng MainCategoriesModel
                const mainCategories = new MainCategoriesModel_1.default({
                    name: name.trim(),
                    title: title.trim(),
                    slug: slug.trim(),
                    description: description.trim(),
                    image: imageUrl.secure_url,
                });
                // Lưu đối tượng vào cơ sở dữ liệu
                yield mainCategories.save();
                // Trả về kết quả thành công
                return res.status(200).json({
                    status: 'Success',
                    message: 'Main Categories have been saved successfully !!!',
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    status: 'Error',
                    message: 'Internal server error',
                });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const mainCategories = yield MainCategoriesModel_1.default.find();
            if (mainCategories) {
                return res.status(200).json({
                    status: 'Success',
                    data: mainCategories,
                });
            }
            else {
                return res.status(404).json({
                    status: 'Error',
                    message: 'Main Categories not found',
                });
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const mainCategory = yield MainCategoriesModel_1.default.findById(id);
            if (mainCategory) {
                return res.status(200).json({
                    status: 'Success',
                    data: mainCategory,
                });
            }
            else {
                return res.status(404).json({
                    status: 'Error',
                    message: 'Main Categories not found',
                });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, title, slug, description } = req.body;
                const image = req.file;
                let imageUrl;
                if (!name || !title || !slug || !description || !image) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Missing required fields',
                    });
                }
                const mainCategory = yield MainCategoriesModel_1.default.findById(id);
                if (image) {
                    const deletedImage = mainCategory === null || mainCategory === void 0 ? void 0 : mainCategory.image;
                    const publicIdRegex = /\/mainCategories\/([^/.]+)/;
                    const matches = deletedImage.match(publicIdRegex);
                    yield cloudinary_1.default.uploader.destroy(`mainCategories/${matches && matches[1]}`, (error, result) => {
                        if (error) {
                            console.error('Failed to delete image:', error);
                            // Xử lý lỗi
                        }
                        else {
                            console.log('Image deleted successfully:', result);
                            // Xử lý khi xóa thành công
                        }
                    });
                    imageUrl = yield cloudinary_1.default.uploader.upload(image.path, {
                        folder: 'mainCategories',
                    });
                    if (mainCategory) {
                        (mainCategory.name = name.trim()),
                            (mainCategory.title = title.trim()),
                            (mainCategory.slug = slug.trim()),
                            (mainCategory.description = description.trim()),
                            (mainCategory.image = imageUrl
                                ? imageUrl.secure_url
                                : '');
                        mainCategory === null || mainCategory === void 0 ? void 0 : mainCategory.save();
                        // Trả về kết quả thành công
                        return res.status(200).json({
                            status: 'Success',
                            message: 'Main Categories have been updated successfully !!!',
                        });
                    }
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    status: 'Error',
                    message: 'Internal server error',
                });
            }
        });
    }
    deleteOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                if (!id) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Missing required fields',
                    });
                }
                const mainCategory = yield MainCategoriesModel_1.default.findById(id);
                if (mainCategory) {
                    const deletedImage = mainCategory === null || mainCategory === void 0 ? void 0 : mainCategory.image;
                    const publicIdRegex = /\/mainCategories\/([^/.]+)/;
                    const matches = deletedImage.match(publicIdRegex);
                    yield cloudinary_1.default.uploader.destroy(`mainCategories/${matches && matches[1]}`, (error, result) => {
                        if (error) {
                            console.error('Failed to delete image:', error);
                            // Xử lý lỗi
                        }
                        else {
                            console.log('Image deleted successfully:', result);
                            // Xử lý khi xóa thành công
                        }
                    });
                    yield (mainCategory === null || mainCategory === void 0 ? void 0 : mainCategory.deleteOne());
                    const confirmDelete = yield MainCategoriesModel_1.default.findById(id);
                    if (confirmDelete) {
                        return res.status(404).json({
                            status: 'Error',
                            message: 'Main Categories not found',
                        });
                    }
                    else {
                        return res.status(200).json({
                            status: 'Success',
                            message: 'Main Categories have been deleted successfully !!!',
                        });
                    }
                }
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
exports.default = AddMainCategoriesController;
