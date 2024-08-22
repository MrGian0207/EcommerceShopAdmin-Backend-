"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantModel = exports.ProductModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const uuid_1 = require("uuid");
const ProductSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    brand: { type: String, required: true },
    gender: { type: String, required: true },
    status: { type: String, required: true },
    productCode: { type: String, required: true },
    tags: { type: [String], required: true },
    featureProduct: { type: String, required: true },
    defaultVariant: { type: String, required: true },
    variants: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Variant',
        },
    ],
}, {
    timestamps: true,
});
const VariantSchema = new mongoose_1.Schema({
    variantID: { type: String, default: uuid_1.v4 },
    variantName: { type: String, required: true },
    variantSize: { type: String, required: true },
    variantColor: { type: String, required: true },
    variantProductSKU: { type: String, required: true },
    variantQuantity: { type: Number, required: true },
    variantRegularPrice: { type: String, required: true },
    variantSalePrice: { type: String, required: true },
    variantImages: { type: [String] },
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Product',
    },
}, {
    timestamps: true,
});
const ProductModel = mongoose_1.default.model('Product', ProductSchema);
exports.ProductModel = ProductModel;
const VariantModel = mongoose_1.default.model('Variant', VariantSchema);
exports.VariantModel = VariantModel;
