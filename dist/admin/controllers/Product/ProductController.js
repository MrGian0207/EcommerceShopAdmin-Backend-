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
const ProductModel_1 = require("../../models/ProductModel");
const cloudinary_1 = __importDefault(require("../../../utils/cloudinary"));
class ProductController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, title, slug, description, category, subCategory, brand, gender, status, productCode, tag, featureProduct, defaultVariant, variantName, variantSize, variantColor, variantProductSKU, variantQuantity, variantRegularPrice, variantSalePrice, variantNumberImagesOfVariant, } = req.body;
                const variantImages = req.files;
                if (!name ||
                    !title ||
                    !slug ||
                    !description ||
                    !category ||
                    !subCategory ||
                    !brand ||
                    !gender ||
                    !status ||
                    !productCode ||
                    !tag ||
                    !featureProduct ||
                    !defaultVariant ||
                    !variantName ||
                    !variantSize ||
                    !variantColor ||
                    !variantProductSKU ||
                    !variantQuantity ||
                    !variantRegularPrice ||
                    !variantSalePrice ||
                    !variantNumberImagesOfVariant) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Missing required fields',
                    });
                }
                const variantNameArray = variantName
                    .trim()
                    .slice(0, -1)
                    .split('-')
                    .map((name) => name.replace(/"/g, ' ').trim());
                const variantSizeArray = variantSize
                    .trim()
                    .slice(0, -1)
                    .split('-')
                    .map((size) => size.replace(/"/g, ' ').trim());
                const variantColorArray = variantColor
                    .trim()
                    .slice(0, -1)
                    .split('-')
                    .map((color) => color.replace(/"/g, ' ').trim());
                const variantProductSKUArray = variantProductSKU
                    .trim()
                    .split(' ');
                const variantQuantityArray = variantQuantity
                    .trim()
                    .split(' ');
                const variantRegularPriceArray = variantRegularPrice
                    .trim()
                    .split(' ');
                const variantSalePriceArray = variantSalePrice
                    .trim()
                    .split(' ');
                const variantNumberImagesOfVariantArray = variantNumberImagesOfVariant
                    .trim()
                    .split(' ')
                    .map((numberImages) => Number.parseInt(numberImages));
                const product = new ProductModel_1.ProductModel({
                    name,
                    title,
                    slug,
                    description,
                    category,
                    subCategory,
                    brand,
                    gender,
                    status,
                    productCode,
                    tag,
                    featureProduct,
                    defaultVariant,
                });
                variantName &&
                    variantNameArray.forEach((variantName, index) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        try {
                            let imagesFileVariant = [];
                            for (let i = 0; i < variantNumberImagesOfVariantArray[index]; i++) {
                                if (variantImages && Array.isArray(variantImages)) {
                                    const imageUrl = yield cloudinary_1.default.uploader.upload((_a = variantImages[0]) === null || _a === void 0 ? void 0 : _a.path, {
                                        folder: 'variant',
                                    });
                                    imagesFileVariant.push(imageUrl.secure_url);
                                    variantImages === null || variantImages === void 0 ? void 0 : variantImages.splice(0, 1);
                                }
                            }
                            const variant = new ProductModel_1.VariantModel({
                                variantName: variantName,
                                variantSize: variantSizeArray[index],
                                variantColor: variantColorArray[index],
                                variantProductSKU: variantProductSKUArray[index],
                                variantQuantity: variantQuantityArray[index],
                                variantRegularPrice: variantRegularPriceArray[index],
                                variantSalePrice: variantSalePriceArray[index],
                                variantImagesFile: imagesFileVariant,
                                product: product._id,
                            });
                            yield variant.save();
                            yield product.updateOne({
                                $push: { variants: variant._id },
                            });
                        }
                        catch (error) {
                            return res.status(500).json({
                                status: 'Error',
                                message: 'Error processing variant',
                            });
                        }
                    }));
                yield product.save();
                return res.json({
                    status: 'Success',
                    message: 'Save Product Successfully !!',
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: 'Error',
                    message: 'Error creating product',
                });
            }
        });
    }
}
exports.default = ProductController;
