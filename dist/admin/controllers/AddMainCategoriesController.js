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
const cloudinay_1 = __importDefault(require("../../utils/cloudinay"));
const MainCategoriesModel_1 = __importDefault(require("../models/MainCategoriesModel"));
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
                const imageUrl = yield cloudinay_1.default.uploader.upload(image.path, {
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
}
exports.default = AddMainCategoriesController;
