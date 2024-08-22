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
const ProductModel_1 = require("../../models/ProductModel");
class ProductController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = JSON.parse(req.body.payload);
                const { name, title, slug, description, category, subCategory, brand, gender, status, productCode, tags, featureProduct, defaultVariant, variants, } = payload;
                const variantImages = req.files;
                console.log(payload);
                console.log(variantImages);
                // Kiểm tra các trường bắt buộc
                const requiredFields = [
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
                    tags,
                    featureProduct,
                    defaultVariant,
                    variants,
                ];
                if (requiredFields.some((field) => !field)) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Missing required fields',
                    });
                }
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
                    tags,
                    featureProduct,
                    defaultVariant,
                });
                yield product.save();
                const variantPromises = variants.map((variant, index) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        let images = [];
                        if (Array.isArray(variantImages)) {
                            images = variantImages.slice(0, variant.numberOfImages);
                            variantImages.splice(0, variant.numberOfImages);
                        }
                        const uploadPromises = images.map((image) => cloudinary_1.default.uploader.upload(image.path, {
                            folder: 'variant',
                        }));
                        const uploadedImages = yield Promise.all(uploadPromises);
                        const newVariant = new ProductModel_1.VariantModel({
                            variantName: variant.variantName,
                            variantSize: variant.variantSize,
                            variantColor: variant.variantColor,
                            variantProductSKU: variant.variantProductSKU,
                            variantQuantity: variant.variantQuantity,
                            variantRegularPrice: variant.variantRegularPrice,
                            variantSalePrice: variant.variantSalePrice,
                            variantImages: uploadedImages.map((img) => img.secure_url),
                            product: product._id,
                        });
                        yield newVariant.save();
                        yield product.updateOne({
                            $push: { variants: newVariant._id },
                        });
                    }
                    catch (err) {
                        console.error('Error processing variant:', err);
                        throw err;
                    }
                }));
                yield Promise.all(variantPromises);
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
        var _a, _b, _c;
        try {
            const page = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) ? (_b = req.query) === null || _b === void 0 ? void 0 : _b.page : '1';
            const search = (_c = req.query) === null || _c === void 0 ? void 0 : _c.search;
            const brandsPerPage = 10;
            let numberOfProducts = 0;
            ProductModel_1.ProductModel.countDocuments({}).then((countDocuments) => {
                numberOfProducts = Math.ceil(countDocuments / brandsPerPage);
            });
            ProductModel_1.ProductModel.find({
                name: { $regex: search, $options: 'i' },
            })
                .populate('variants')
                .skip((parseInt(page) - 1) * brandsPerPage)
                .limit(brandsPerPage)
                .then((products) => {
                const data = products.map((product) => {
                    var _a, _b, _c;
                    const productObject = product.toObject();
                    const variantDefault = (_a = productObject.variants) === null || _a === void 0 ? void 0 : _a.find((variant) => variant.variantName === productObject.defaultVariant);
                    const totalProducts = (_b = productObject.variants) === null || _b === void 0 ? void 0 : _b.reduce((total, variant) => (total + variant.variantQuantity) | 0, 0);
                    return Object.assign(Object.assign({}, productObject), { image: (_c = variantDefault === null || variantDefault === void 0 ? void 0 : variantDefault.variantImages) === null || _c === void 0 ? void 0 : _c[0], priceDefault: variantDefault === null || variantDefault === void 0 ? void 0 : variantDefault.variantRegularPrice, totalProducts });
                });
                return res.status(200).json({ data: data, numbers: numberOfProducts });
            })
                .catch((err) => {
                return res.status(500).json({
                    status: 'Error',
                    message: err.message,
                });
            });
        }
        catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: 'Error fetching products',
            });
        }
    }
    activeProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const update = req.body;
                const product = yield ProductModel_1.ProductModel.findByIdAndUpdate(update.id, {
                    featureProduct: update.featureState,
                });
                if (product) {
                    return res.status(200).json({
                        message: 'Featured Product State updated successfully',
                    });
                }
                else {
                    return res.status(404).json({
                        message: 'Product not found',
                    });
                }
            }
            catch (error) {
                return res.status(500).json({
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
                    console.log(product);
                    return res.status(200).json(product);
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
            var _a, _b;
            try {
                const { id } = req.params;
                let { name, title, slug, description, category, subCategory, brand, gender, status, productCode, tags, featureProduct, defaultVariant, variantName, variantSize, variantColor, variantProductSKU, variantQuantity, variantRegularPrice, variantSalePrice, variantNumberImagesOfVariants, idVariantArray, idVariantDeletedArray, } = req.body;
                const variantImages = req.files;
                // Kiểm tra các trường bắt buộc
                const requiredFields = [
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
                    tags,
                    featureProduct,
                ];
                if (requiredFields.some((field) => !field)) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Missing required fields',
                    });
                }
                // Xử lý get idVariantArray và idVariantDeletedArray
                let idArray = [];
                let idDeletedArray = [];
                if (typeof idVariantArray === 'string' && idVariantArray !== undefined) {
                    idArray = [idVariantArray];
                }
                else {
                    idArray = idVariantArray;
                }
                let VariantName = [];
                if (typeof variantName === 'string') {
                    VariantName = [variantName];
                }
                else {
                    VariantName = variantName;
                }
                if (typeof idVariantDeletedArray === 'string' && idVariantDeletedArray !== undefined) {
                    idDeletedArray = [idVariantDeletedArray];
                }
                else {
                    idDeletedArray = idVariantDeletedArray;
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
                    tags,
                    featureProduct,
                    defaultVariant,
                });
                if (product) {
                    if (idDeletedArray !== undefined) {
                        yield ProductModel_1.VariantModel.deleteMany({
                            _id: {
                                $in: idDeletedArray,
                            },
                        });
                    }
                    let variantNumberImagesOfVariantArray = [];
                    if (variantNumberImagesOfVariants) {
                        variantNumberImagesOfVariantArray = variantNumberImagesOfVariants
                            .trim()
                            .split(' ')
                            .map((numberImages) => Number.parseInt(numberImages));
                    }
                    if (idArray !== undefined) {
                        // Case: Có idArray thì update variant và thêm những variant mới từ phía client gửi (nếu có)
                        try {
                            for (let index = 0; index < (VariantName === null || VariantName === void 0 ? void 0 : VariantName.length); index++) {
                                // Lấy ra những image có thay đổi hoặc update
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
                                // Update đối với những variant đã tồn tại trong DB
                                if (index <= idArray.length - 1) {
                                    // lấy ra những hình ảnh đã được upload trên db của variant.
                                    let uploadedImage = [];
                                    const variantUpdated = yield ProductModel_1.VariantModel.findById({
                                        _id: idArray[index],
                                    });
                                    if (variantUpdated) {
                                        uploadedImage = variantUpdated.variantImages;
                                    }
                                    const variant = yield ProductModel_1.VariantModel.findOneAndUpdate({
                                        _id: idArray[index],
                                    }, {
                                        variantName: VariantName[index],
                                        variantSize: typeof variantSize === 'string' ? variantSize : variantSize[index],
                                        variantColor: typeof variantColor === 'string' ? variantColor : variantColor[index],
                                        variantProductSKU: typeof variantProductSKU === 'string'
                                            ? variantProductSKU
                                            : variantProductSKU[index],
                                        variantQuantity: typeof variantQuantity === 'string'
                                            ? variantQuantity
                                            : variantQuantity[index],
                                        variantRegularPrice: typeof variantRegularPrice === 'string'
                                            ? variantRegularPrice
                                            : variantRegularPrice[index],
                                        variantSalePrice: typeof variantSalePrice === 'string'
                                            ? variantSalePrice
                                            : variantSalePrice[index],
                                        variantImagesFile: (imagesFileVariant === null || imagesFileVariant === void 0 ? void 0 : imagesFileVariant.length) > 0
                                            ? imagesFileVariant.concat(uploadedImage)
                                            : uploadedImage,
                                    });
                                    // check Variant đã được update hay chưa.
                                    if (!variant) {
                                        return res.status(404).json({
                                            status: 'Error',
                                            message: 'Variant has not been updated successfully',
                                        });
                                    }
                                }
                                else {
                                    // Tạo variant mới được thêm vào từ phía client
                                    const variant = new ProductModel_1.VariantModel({
                                        variantName: VariantName[index],
                                        variantSize: typeof variantSize === 'string' ? variantSize : variantSize[index],
                                        variantColor: typeof variantColor === 'string' ? variantColor : variantColor[index],
                                        variantProductSKU: typeof variantProductSKU === 'string'
                                            ? variantProductSKU
                                            : variantProductSKU[index],
                                        variantQuantity: typeof variantQuantity === 'string' ? variantQuantity : variantQuantity[index],
                                        variantRegularPrice: typeof variantRegularPrice === 'string'
                                            ? variantRegularPrice
                                            : variantRegularPrice[index],
                                        variantSalePrice: typeof variantSalePrice === 'string'
                                            ? variantSalePrice
                                            : variantSalePrice[index],
                                        variantImagesFile: imagesFileVariant,
                                        product: product._id,
                                    });
                                    yield variant.save();
                                    yield product.updateOne({
                                        $push: { variants: variant._id },
                                    });
                                }
                            }
                        }
                        catch (error) {
                            console.log(error);
                        }
                    }
                    else {
                        // Case: Không có idArray thì thêm những variant mới từ phía client gửi
                        for (let index = 0; index < (VariantName === null || VariantName === void 0 ? void 0 : VariantName.length); index++) {
                            try {
                                // Lấy ra những image có thay đổi hoặc update
                                let imagesFileVariant = [];
                                for (let i = 0; i < variantNumberImagesOfVariantArray[index]; i++) {
                                    if (variantImages && Array.isArray(variantImages)) {
                                        const imageUrl = yield cloudinary_1.default.uploader.upload((_b = variantImages[0]) === null || _b === void 0 ? void 0 : _b.path, {
                                            folder: 'variant',
                                        });
                                        imagesFileVariant.push(imageUrl.secure_url);
                                        variantImages === null || variantImages === void 0 ? void 0 : variantImages.splice(0, 1);
                                    }
                                }
                                const variant = new ProductModel_1.VariantModel({
                                    variantName: VariantName[index],
                                    variantSize: typeof variantSize === 'string' ? variantSize : variantSize[index],
                                    variantColor: typeof variantColor === 'string' ? variantColor : variantColor[index],
                                    variantProductSKU: typeof variantProductSKU === 'string'
                                        ? variantProductSKU
                                        : variantProductSKU[index],
                                    variantQuantity: typeof variantQuantity === 'string' ? variantQuantity : variantQuantity[index],
                                    variantRegularPrice: typeof variantRegularPrice === 'string'
                                        ? variantRegularPrice
                                        : variantRegularPrice[index],
                                    variantSalePrice: typeof variantSalePrice === 'string' ? variantSalePrice : variantSalePrice[index],
                                    variantImagesFile: imagesFileVariant,
                                    product: product._id,
                                });
                                yield variant.save();
                                yield product.updateOne({
                                    $push: { variants: variant._id },
                                });
                            }
                            catch (error) {
                                console.log(error);
                                return res.status(500).json({
                                    status: 'Error',
                                    message: 'Error creating product',
                                });
                            }
                        }
                    }
                }
                return res.status(200).json({
                    status: 'Success',
                    message: 'Product updated successfully',
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    status: 'Error',
                    message: 'Error processing variant',
                });
            }
        });
    }
    deleteOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Missing required fields',
                    });
                }
                const product = yield ProductModel_1.ProductModel.findById(id);
                if (product) {
                    const variants = yield ProductModel_1.VariantModel.find({
                        product: id,
                    });
                    for (let index = 0; index < variants.length; index++) {
                        // Lấy tất cả các ảnh trong variant
                        const deletedImageArray = variants[index].variantImages;
                        // Xóa hết tất cả các ảnh đó ở trên Cloudinary
                        for (let i = 0; i < (deletedImageArray === null || deletedImageArray === void 0 ? void 0 : deletedImageArray.length); i++) {
                            const deletedImage = deletedImageArray[i];
                            const pulicRegex = /\/variant\/([^/.]+)/;
                            const matches = deletedImage.match(pulicRegex);
                            yield cloudinary_1.default.uploader.destroy(`variant/${matches && matches[1]}`, (error, result) => {
                                if (error) {
                                    console.error('Failed to delete image:', error);
                                    // Xử lý lỗi
                                }
                                else {
                                    console.log('Image deleted successfully:', result);
                                    // Xử lý khi xóa thành công
                                }
                            });
                        }
                    }
                    // Xóa hết tất cả variant trong product
                    try {
                        yield ProductModel_1.VariantModel.deleteMany({ product: id });
                        console.log('Đã xóa thành công');
                    }
                    catch (error) {
                        console.log(error);
                    }
                    // Confirm delete variants and product
                    const variantsIsDeleted = yield ProductModel_1.VariantModel.find({
                        product: id,
                    });
                    // Confirm variants is deleated and delete Product
                    if (variantsIsDeleted) {
                        yield ProductModel_1.ProductModel.deleteOne({ _id: id });
                        return res.status(200).json({
                            status: 'Success',
                            message: 'Product deleted successfully',
                        });
                    }
                    else {
                        return res.status(404).json({
                            status: 'Error',
                            message: 'Product has not been deleted successfully',
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
exports.default = ProductController;
