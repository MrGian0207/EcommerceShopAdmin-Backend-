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
const SubCategoriesModel_1 = __importDefault(require("../../models/SubCategoriesModel"));
class SubCategoriesController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, title, slug, description, category } = req.body;
                const image = req.file;
                // Kiểm tra các trường bắt buộc
                if (!name ||
                    !title ||
                    !slug ||
                    !description ||
                    !category ||
                    !image) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Missing required fields',
                    });
                }
                // Tải lên hình ảnh lên Cloudinary
                const imageUrl = yield cloudinary_1.default.uploader.upload(image.path, {
                    folder: 'subCategories',
                });
                // Kiểm tra nếu hình ảnh không tải lên thành công
                if (!imageUrl || !imageUrl.secure_url) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Failed to upload image',
                    });
                }
                // Tạo đối tượng SubCategoriesModel
                const subCategories = new SubCategoriesModel_1.default({
                    name: name.trim(),
                    title: title.trim(),
                    slug: slug.trim(),
                    description: description.trim(),
                    parentCategory: category.trim(),
                    image: imageUrl.secure_url,
                });
                // Lưu đối tượng vào cơ sở dữ liệu
                yield subCategories.save();
                // Trả về kết quả thành công
                return res.status(200).json({
                    status: 'Success',
                    message: 'Sub Categories have been saved successfully !!!',
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
            const subCategories = yield SubCategoriesModel_1.default.find();
            if (subCategories) {
                return res.status(200).json({
                    status: 'Success',
                    data: subCategories,
                });
            }
            else {
                return res.status(404).json({
                    status: 'Error',
                    message: 'Sub Categories not found',
                });
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const subCategory = yield SubCategoriesModel_1.default.findById(id);
            if (subCategory) {
                return res.status(200).json({
                    status: 'Success',
                    data: subCategory,
                });
            }
            else {
                return res.status(404).json({
                    status: 'Error',
                    message: 'Sub Categories not found',
                });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, title, slug, description, category } = req.body;
                const image = req.file;
                let imageUrl;
                if (!name || !title || !slug || !description || !category) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Missing required fields',
                    });
                }
                const subCategory = yield SubCategoriesModel_1.default.findById(id);
                if (image) {
                    const deletedImage = subCategory === null || subCategory === void 0 ? void 0 : subCategory.image;
                    const publicIdRegex = /\/subCategories\/([^/.]+)/;
                    const matches = deletedImage.match(publicIdRegex);
                    yield cloudinary_1.default.uploader.destroy(`subCategories/${matches && matches[1]}`, (error, result) => {
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
                        folder: 'subCategories',
                    });
                    if (subCategory) {
                        (subCategory.name = name.trim()),
                            (subCategory.title = title.trim()),
                            (subCategory.slug = slug.trim()),
                            (subCategory.description = description.trim()),
                            (subCategory.parentCategory = category.trim()),
                            (subCategory.image = imageUrl
                                ? imageUrl.secure_url
                                : '');
                        subCategory === null || subCategory === void 0 ? void 0 : subCategory.save();
                        // Trả về kết quả thành công
                        return res.status(200).json({
                            status: 'Success',
                            message: 'Sub Categories have been updated successfully !!!',
                        });
                    }
                }
                else {
                    if (subCategory) {
                        (subCategory.name = name.trim()),
                            (subCategory.title = title.trim()),
                            (subCategory.slug = slug.trim()),
                            (subCategory.description = description.trim()),
                            (subCategory.parentCategory = category.trim()),
                            subCategory === null || subCategory === void 0 ? void 0 : subCategory.save();
                        // Trả về kết quả thành công
                        return res.status(200).json({
                            status: 'Success',
                            message: 'Sub Categories have been updated successfully !!!',
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
                const subCategory = yield SubCategoriesModel_1.default.findById(id);
                if (subCategory) {
                    const deletedImage = subCategory === null || subCategory === void 0 ? void 0 : subCategory.image;
                    const publicIdRegex = /\/subCategories\/([^/.]+)/;
                    const matches = deletedImage.match(publicIdRegex);
                    yield cloudinary_1.default.uploader.destroy(`subCategories/${matches && matches[1]}`, (error, result) => {
                        if (error) {
                            console.error('Failed to delete image:', error);
                            // Xử lý lỗi
                        }
                        else {
                            console.log('Image deleted successfully:', result);
                            // Xử lý khi xóa thành công
                        }
                    });
                    yield (subCategory === null || subCategory === void 0 ? void 0 : subCategory.deleteOne());
                    const confirmDelete = yield SubCategoriesModel_1.default.findById(id);
                    if (confirmDelete) {
                        return res.status(404).json({
                            status: 'Error',
                            message: 'Sub Categories not found',
                        });
                    }
                    else {
                        return res.status(200).json({
                            status: 'Success',
                            message: 'Sub Categories have been deleted successfully !!!',
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
    subCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const nameSubCategories = yield SubCategoriesModel_1.default.distinct('name');
            if (nameSubCategories) {
                return res.status(200).json({
                    status: 'Success',
                    data: nameSubCategories,
                });
            }
            else {
                return res.status(404).json({
                    status: 'Error',
                    message: 'Sub Categories not found',
                });
            }
        });
    }
}
exports.default = SubCategoriesController;
