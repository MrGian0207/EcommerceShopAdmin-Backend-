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
const OrdersModel_1 = __importDefault(require("../../models/OrdersModel"));
const ProductModel_1 = require("../../models/ProductModel");
class OrdersController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { customerName, customerPhone, customerEmail, customerAddress, methodDelivery, statusDelivery, shippingFee, colorProducts, quantityProducts, sizeProducts, priceProducts, subtotal, total, products, } = req.body;
            const requiredFields = [
                customerName,
                customerPhone,
                customerEmail,
                customerAddress,
                methodDelivery,
                statusDelivery,
                shippingFee,
                colorProducts,
                quantityProducts,
                sizeProducts,
                priceProducts,
                subtotal,
                total,
                products,
            ];
            if (requiredFields.some((field) => !field)) {
                return res.status(400).json({
                    status: 'Error',
                    message: 'Missing required fields',
                });
            }
            try {
                const variant = yield ProductModel_1.VariantModel.find({
                    product: products[0],
                });
                const order = new OrdersModel_1.default({
                    customerName: customerName,
                    customerPhone: customerPhone,
                    customerEmail: customerEmail,
                    customerAddress: customerAddress,
                    methodDelivery: methodDelivery,
                    statusDelivery: statusDelivery,
                    shippingFee: shippingFee,
                    imageDefault: variant[0]
                        ? (_a = variant[0].variantImagesFile) === null || _a === void 0 ? void 0 : _a[0]
                        : '',
                    colorProducts: colorProducts,
                    quantityProducts: quantityProducts,
                    sizeProducts: sizeProducts,
                    priceProducts: priceProducts,
                    subtotal: subtotal,
                    total: total,
                    products: products,
                });
                yield order.save();
                console.log('Tao thanh cong');
                return res.status(200).json({
                    status: 'Success',
                    message: 'Order was successfully',
                });
            }
            catch (error) {
                console.log(error);
                return res.status(404).json({
                    status: 'Error',
                    message: 'Orders have not been created',
                });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield OrdersModel_1.default.find();
                return res.json({
                    status: 'Success',
                    data: orders,
                });
            }
            catch (error) {
                console.log(error);
                return res.status(404).json({
                    status: 'Error',
                    message: ' Orders not founded',
                });
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = req.params.id;
                const order = yield OrdersModel_1.default.findOne({ _id: id }).populate('products');
                const idProducts = (_a = order === null || order === void 0 ? void 0 : order.products) === null || _a === void 0 ? void 0 : _a.map((product) => product._id);
                let imagesOfProduct = [];
                for (let index = 0; index < idProducts.length; index++) {
                    const images = (yield ProductModel_1.VariantModel.find({
                        product: idProducts[index],
                    }).distinct('variantImagesFile'));
                    imagesOfProduct.push(images[0]);
                }
                return res.status(200).json({
                    status: 'Success',
                    data: { order, imagesOfProduct },
                });
            }
            catch (error) {
                console.log(error);
                return res.status(404).json({
                    status: 'Error',
                    message: 'Order not found',
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
                const orderDeleted = yield OrdersModel_1.default.findByIdAndDelete({ _id: id });
                if (orderDeleted) {
                    return res.status(200).json({
                        status: 'Success',
                        message: 'Order deleted successfully',
                    });
                }
            }
            catch (error) {
                console.log(error);
                res.status(404).json({
                    status: 'Error',
                    message: 'Order not deleted successfully',
                });
            }
        });
    }
    updateOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { statusOrder } = req.body;
                const order = yield OrdersModel_1.default.findByIdAndUpdate(id, {
                    statusDelivery: statusOrder,
                });
                if (order) {
                    res.status(200).json({
                        status: 'Success',
                        message: 'Order updated status delivered successfully',
                    });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(404).json({
                    status: 'Error',
                    message: 'Order not updated successfully',
                });
            }
        });
    }
}
exports.default = OrdersController;
