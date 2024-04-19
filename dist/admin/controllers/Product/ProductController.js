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
                const { name, title, slug, description, category, subCategory, brand, gender, status, productCode, tag, featureProduct, defaultVariant, variantName, variantSize, variantColor, variantProductSKU, variantQuantity, variantRegularPrice, variantSalePrice, variantNumberImagesOfVariants, } = req.body;
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
                    !variantNumberImagesOfVariants) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Missing required fields',
                    });
                }
                const variantNumberImagesOfVariantArray = variantNumberImagesOfVariants
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
                    variantName.forEach((name, index) => __awaiter(this, void 0, void 0, function* () {
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
                                variantName: name,
                                variantSize: variantSize[index],
                                variantColor: variantColor[index],
                                variantProductSKU: variantProductSKU[index],
                                variantQuantity: variantQuantity[index],
                                variantRegularPrice: variantRegularPrice[index],
                                variantSalePrice: variantSalePrice[index],
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
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield ProductModel_1.ProductModel.find();
                let variants = [];
                let quantity = [];
                yield Promise.all(products.map((product, index) => __awaiter(this, void 0, void 0, function* () {
                    const variantDefault = (yield ProductModel_1.VariantModel.findOne({
                        variantName: product.defaultVariant,
                    }));
                    if (variants) {
                        variants[index] = variantDefault;
                    }
                    const variantArray = yield ProductModel_1.VariantModel.find({
                        product: product._id,
                    });
                    if (quantity && variantArray.length > 0) {
                        const totalQuantity = variantArray.reduce((acc, variant) => acc + parseInt(variant.variantQuantity || '0'), 0);
                        quantity[index] = totalQuantity;
                    }
                })));
                if (products.length > 0) {
                    return res.status(200).json({
                        status: 'Success',
                        data: products,
                        variants: variants,
                        quantity: quantity,
                    });
                }
                else {
                    return res.status(404).json({
                        status: 'Error',
                        message: 'Products not found',
                    });
                }
            }
            catch (error) {
                return res.status(500).json({
                    status: 'Error',
                    message: 'Error fetching products',
                });
            }
        });
    }
    activeProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const update = req.body;
                const product = yield ProductModel_1.ProductModel.findByIdAndUpdate(update._id, {
                    featureProduct: update.feature,
                });
                if (product) {
                    return res.status(200).json({
                        status: 'Success',
                        message: `${product === null || product === void 0 ? void 0 : product.name} active successfully`,
                    });
                }
                else {
                    return res.status(404).json({
                        status: 'Error',
                        message: 'Product not found',
                    });
                }
            }
            catch (error) {
                return res.status(500).json({
                    status: 'Error',
                    message: 'Error activating product',
                });
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const product = yield ProductModel_1.ProductModel.findById(id).populate('variants');
                if (product) {
                    return res.status(200).json({
                        status: 'Success',
                        data: product,
                    });
                }
            }
            catch (error) {
                return res.status(500).json({
                    status: 'Error',
                    message: 'Error fetching product',
                });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, title, slug, description, category, subCategory, brand, gender, status, productCode, tag, featureProduct, defaultVariant, variantName, variantSize, variantColor, variantProductSKU, variantQuantity, variantRegularPrice, variantSalePrice, variantNumberImagesOfVariants, } = req.body;
                const variantImages = req.files;
                console.log(variantImages);
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
                    !variantNumberImagesOfVariants) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Missing required fields',
                    });
                }
                const product = yield ProductModel_1.ProductModel.findByIdAndUpdate(id, {
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
                if (product) {
                    const variantNumberImagesOfVariantArray = variantNumberImagesOfVariants
                        .trim()
                        .split(' ')
                        .map((numberImages) => Number.parseInt(numberImages));
                    variantName &&
                        variantName.forEach((name, index) => __awaiter(this, void 0, void 0, function* () {
                            var _a;
                            try {
                                if ((variantImages === null || variantImages === void 0 ? void 0 : variantImages.length) &&
                                    (variantImages === null || variantImages === void 0 ? void 0 : variantImages.length) > 0) {
                                    let imagesFileVariant = [];
                                    for (let i = 0; i <
                                        variantNumberImagesOfVariantArray[index]; i++) {
                                        if (variantImages &&
                                            Array.isArray(variantImages)) {
                                            const imageUrl = yield cloudinary_1.default.uploader.upload((_a = variantImages[0]) === null || _a === void 0 ? void 0 : _a.path, {
                                                folder: 'variant',
                                            });
                                            imagesFileVariant.push(imageUrl.secure_url);
                                            variantImages === null || variantImages === void 0 ? void 0 : variantImages.splice(0, 1);
                                        }
                                    }
                                    const variantIsExisted = yield ProductModel_1.VariantModel.findOne({
                                        variantName: name,
                                    });
                                    if (!variantIsExisted) {
                                        const variant = new ProductModel_1.VariantModel({
                                            variantName: name,
                                            variantSize: variantSize[index],
                                            variantColor: variantColor[index],
                                            variantProductSKU: variantProductSKU[index],
                                            variantQuantity: variantQuantity[index],
                                            variantRegularPrice: variantRegularPrice[index],
                                            variantSalePrice: variantSalePrice[index],
                                            variantImagesFile: imagesFileVariant,
                                            product: product._id,
                                        });
                                        yield variant.save();
                                        yield product.updateOne({
                                            $push: { variants: variant._id },
                                        });
                                    }
                                    else {
                                        const variant = yield ProductModel_1.VariantModel.findOneAndUpdate({ variantName: name }, {
                                            variantName: name,
                                            variantSize: variantSize[index],
                                            variantColor: variantColor[index],
                                            variantProductSKU: variantProductSKU[index],
                                            variantQuantity: variantQuantity[index],
                                            variantRegularPrice: variantRegularPrice[index],
                                            variantSalePrice: variantSalePrice[index],
                                            variantImagesFile: imagesFileVariant,
                                        });
                                        if (!variant) {
                                            return res.status(500).json({
                                                status: 'Error',
                                                message: 'Error processing variant',
                                            });
                                        }
                                    }
                                }
                                else {
                                    const variant = yield ProductModel_1.VariantModel.findOneAndUpdate({ variantName: name }, {
                                        variantName: name,
                                        variantSize: variantSize[index],
                                        variantColor: variantColor[index],
                                        variantProductSKU: variantProductSKU[index],
                                        variantQuantity: variantQuantity[index],
                                        variantRegularPrice: variantRegularPrice[index],
                                        variantSalePrice: variantSalePrice[index],
                                    });
                                    if (!variant) {
                                        return res.status(500).json({
                                            status: 'Error',
                                            message: 'Error processing variant',
                                        });
                                    }
                                }
                            }
                            catch (error) {
                                return res.status(500).json({
                                    status: 'Error',
                                    message: 'Error processing variant',
                                });
                            }
                        }));
                }
                return res.status(200).json({
                    status: 'Success',
                    message: 'Product updated successfully',
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: 'Error',
                    message: 'Error processing variant',
                });
            }
        });
    }
}
exports.default = ProductController;
