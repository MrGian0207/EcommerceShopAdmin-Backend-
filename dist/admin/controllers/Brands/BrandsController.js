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
const BrandsModel_1 = __importDefault(require("../../models/BrandsModel"));
class BrandsController {
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
                    folder: 'brands',
                });
                // Kiểm tra nếu hình ảnh không tải lên thành công
                if (!imageUrl || !imageUrl.secure_url) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Failed to upload image',
                    });
                }
                // Tạo đối tượng BrandsModel
                const brands = new BrandsModel_1.default({
                    name: name.trim(),
                    title: title.trim(),
                    slug: slug.trim(),
                    description: description.trim(),
                    image: imageUrl.secure_url,
                });
                // Lưu đối tượng vào cơ sở dữ liệu
                yield brands.save();
                // Trả về kết quả thành công
                return res.status(200).json({
                    status: 'Success',
                    message: 'Brands have been saved successfully !!!',
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
            var _a, _b;
            const page = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page)
                ? (_b = req.query) === null || _b === void 0 ? void 0 : _b.page
                : '1';
            const brandsPerPage = 3;
            let numberOfBrands = 0;
            yield BrandsModel_1.default.countDocuments({}).then((countDocuments) => {
                numberOfBrands = Math.ceil(countDocuments / brandsPerPage);
            });
            const brands = yield BrandsModel_1.default.find()
                .skip((parseInt(page) - 1) * brandsPerPage)
                .limit(brandsPerPage);
            if (brands) {
                return res.status(200).json({
                    status: 'Success',
                    data: brands,
                    numbers: numberOfBrands,
                });
            }
            else {
                return res.status(404).json({
                    status: 'Error',
                    message: 'Brands not found',
                });
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const brands = yield BrandsModel_1.default.findById(id);
            if (brands) {
                return res.status(200).json({
                    status: 'Success',
                    data: brands,
                });
            }
            else {
                return res.status(404).json({
                    status: 'Error',
                    message: 'Brands not found',
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
                if (!name || !title || !slug || !description) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Missing required fields',
                    });
                }
                const brands = yield BrandsModel_1.default.findById(id);
                if (image) {
                    const deletedImage = brands === null || brands === void 0 ? void 0 : brands.image;
                    const publicIdRegex = /\/brands\/([^/.]+)/;
                    const matches = deletedImage.match(publicIdRegex);
                    yield cloudinary_1.default.uploader.destroy(`brands/${matches && matches[1]}`, (error, result) => {
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
                        folder: 'brands',
                    });
                    if (brands) {
                        (brands.name = name.trim()),
                            (brands.title = title.trim()),
                            (brands.slug = slug.trim()),
                            (brands.description = description.trim()),
                            (brands.image = imageUrl ? imageUrl.secure_url : '');
                        brands === null || brands === void 0 ? void 0 : brands.save();
                        // Trả về kết quả thành công
                        return res.status(200).json({
                            status: 'Success',
                            message: 'Brands have been updated successfully !!!',
                        });
                    }
                }
                else {
                    if (brands) {
                        (brands.name = name.trim()),
                            (brands.title = title.trim()),
                            (brands.slug = slug.trim()),
                            (brands.description = description.trim()),
                            brands === null || brands === void 0 ? void 0 : brands.save();
                        // Trả về kết quả thành công
                        return res.status(200).json({
                            status: 'Success',
                            message: 'Brands have been updated successfully !!!',
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
                const brands = yield BrandsModel_1.default.findById(id);
                if (brands) {
                    const deletedImage = brands === null || brands === void 0 ? void 0 : brands.image;
                    const publicIdRegex = /\/brands\/([^/.]+)/;
                    const matches = deletedImage.match(publicIdRegex);
                    yield cloudinary_1.default.uploader.destroy(`brands/${matches && matches[1]}`, (error, result) => {
                        if (error) {
                            console.error('Failed to delete image:', error);
                            // Xử lý lỗi
                        }
                        else {
                            console.log('Image deleted successfully:', result);
                            // Xử lý khi xóa thành công
                        }
                    });
                    yield (brands === null || brands === void 0 ? void 0 : brands.deleteOne());
                    const confirmDelete = yield BrandsModel_1.default.findById(id);
                    if (confirmDelete) {
                        return res.status(404).json({
                            status: 'Error',
                            message: 'Brands not found',
                        });
                    }
                    else {
                        return res.status(200).json({
                            status: 'Success',
                            message: 'Brands have been deleted successfully !!!',
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
    brands(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const nameBrands = yield BrandsModel_1.default.distinct('name');
            if (nameBrands) {
                return res.status(200).json({
                    status: 'Success',
                    data: nameBrands,
                });
            }
            else {
                return res.status(404).json({
                    status: 'Error',
                    message: 'Brands not found',
                });
            }
        });
    }
}
exports.default = BrandsController;
