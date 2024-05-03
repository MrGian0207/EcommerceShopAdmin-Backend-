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
            var _a;
            try {
                const { name, title, slug, description, category, subCategory, brand, gender, status, productCode, tag, featureProduct, defaultVariant, variantName, variantSize, variantColor, variantProductSKU, variantQuantity, variantRegularPrice, variantSalePrice, variantNumberImagesOfVariants, } = req.body;
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
                    tag,
                    featureProduct,
                    defaultVariant,
                    variantName,
                    variantSize,
                    variantColor,
                    variantProductSKU,
                    variantQuantity,
                    variantRegularPrice,
                    variantSalePrice,
                    variantNumberImagesOfVariants,
                ];
                if (requiredFields.some((field) => !field)) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Missing required fields',
                    });
                }
                let VariantName = [];
                if (typeof variantName === 'string') {
                    VariantName = [variantName];
                }
                else {
                    VariantName = variantName;
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
                yield product.save();
                if (variantName) {
                    for (let index = 0; index < VariantName.length; index++) {
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
                                variantName: typeof variantName[index] === 'string'
                                    ? variantName
                                    : variantName[index],
                                variantSize: typeof variantSize[index] === 'number'
                                    ? variantSize
                                    : variantSize[index],
                                variantColor: typeof variantColor[index] === 'string'
                                    ? variantColor
                                    : variantColor[index],
                                variantProductSKU: typeof variantProductSKU[index] === 'string'
                                    ? variantProductSKU
                                    : variantProductSKU[index],
                                variantQuantity: typeof variantQuantity[index] === 'string'
                                    ? variantQuantity
                                    : variantQuantity[index],
                                variantRegularPrice: typeof variantRegularPrice[index] === 'string'
                                    ? variantRegularPrice
                                    : variantRegularPrice[index],
                                variantSalePrice: typeof variantSalePrice[index] === 'string'
                                    ? variantSalePrice
                                    : variantSalePrice[index],
                                variantImagesFile: (imagesFileVariant === null || imagesFileVariant === void 0 ? void 0 : imagesFileVariant.length) > 0 ? imagesFileVariant : [],
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
                    }
                }
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
            var _a, _b, _c;
            try {
                const page = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page)
                    ? (_b = req.query) === null || _b === void 0 ? void 0 : _b.page
                    : '1';
                const search = (_c = req.query) === null || _c === void 0 ? void 0 : _c.search;
                const brandsPerPage = 10;
                let numberOfProducts = 0;
                yield ProductModel_1.ProductModel.countDocuments({}).then((countDocuments) => {
                    numberOfProducts = Math.ceil(countDocuments / brandsPerPage);
                });
                const products = yield ProductModel_1.ProductModel.find({
                    name: { $regex: search, $options: 'i' },
                })
                    .skip((parseInt(page) - 1) * brandsPerPage)
                    .limit(brandsPerPage);
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
                        numbers: numberOfProducts,
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
                        message: `${product === null || product === void 0 ? void 0 : product.name} ${(product === null || product === void 0 ? void 0 : product.featureProduct) === 'active' ? 'Inactive' : 'Active'} successfully`,
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
            var _a, _b;
            try {
                const { id } = req.params;
                let { name, title, slug, description, category, subCategory, brand, gender, status, productCode, tag, featureProduct, defaultVariant, variantName, variantSize, variantColor, variantProductSKU, variantQuantity, variantRegularPrice, variantSalePrice, variantNumberImagesOfVariants, idVariantArray, idVariantDeletedArray, } = req.body;
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
                    tag,
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
                if (typeof idVariantDeletedArray === 'string' &&
                    idVariantDeletedArray !== undefined) {
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
                    tag,
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
                                        uploadedImage = variantUpdated.variantImagesFile;
                                    }
                                    const variant = yield ProductModel_1.VariantModel.findOneAndUpdate({
                                        _id: idArray[index],
                                    }, {
                                        variantName: VariantName[index],
                                        variantSize: typeof variantSize === 'string'
                                            ? variantSize
                                            : variantSize[index],
                                        variantColor: typeof variantColor === 'string'
                                            ? variantColor
                                            : variantColor[index],
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
                                        variantSize: typeof variantSize === 'string'
                                            ? variantSize
                                            : variantSize[index],
                                        variantColor: typeof variantColor === 'string'
                                            ? variantColor
                                            : variantColor[index],
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
                                    variantSize: typeof variantSize === 'string'
                                        ? variantSize
                                        : variantSize[index],
                                    variantColor: typeof variantColor === 'string'
                                        ? variantColor
                                        : variantColor[index],
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
                        const deletedImageArray = variants[index]
                            .variantImagesFile;
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
