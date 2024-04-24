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
const SlideModel_1 = __importDefault(require("../../models/SlideModel"));
class SlideController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { heading, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink, description, displaySlide, } = req.body;
                const image = req.file;
                console.log(req.body);
                console.log(image);
                const requiredFields = [
                    heading,
                    primaryButtonText,
                    secondaryButtonText,
                    description,
                    displaySlide,
                    image,
                ];
                if (requiredFields.some((field) => !field)) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Missing required fields',
                    });
                }
                // Tải hình ảnh lên Cloudinary
                let imageUrl;
                if (image) {
                    imageUrl = yield cloudinary_1.default.uploader.upload(image.path, {
                        folder: 'slides',
                    });
                    // Kiểm tra nếu hình ảnh không tải lên thành công
                    if (!imageUrl || !imageUrl.secure_url) {
                        return res.status(400).json({
                            status: 'Error',
                            message: 'Failed to upload image',
                        });
                    }
                    const slide = new SlideModel_1.default({
                        heading,
                        primaryButtonText,
                        primaryButtonLink,
                        secondaryButtonText,
                        secondaryButtonLink,
                        description,
                        displaySlide,
                        image: imageUrl.secure_url,
                    });
                    yield slide.save();
                    return res.status(200).json({
                        status: 'Success',
                        message: 'Slide have been saved successfully',
                    });
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
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slides = yield SlideModel_1.default.find();
                return res.status(200).json({
                    status: 'Success',
                    data: slides,
                });
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
exports.default = SlideController;
