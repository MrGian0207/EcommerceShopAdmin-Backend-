import mongoose, { Schema } from 'mongoose';
import { Product, Variant } from '../../types/ProductType';
const ProductSchema = new Schema<Product>(
   {
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
      tag: { type: String, required: true },
      featureProduct: { type: String, required: true },
      defaultVariant: { type: String, required: true },
      variants: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Variant',
         },
      ],
   },
   {
      timestamps: true,
   },
);

const VariantSchema = new Schema<Variant>(
   {
      variantName: { type: String, required: true },
      variantSize: { type: String, required: true },
      variantColor: { type: String, required: true },
      variantProductSKU: { type: String, required: true },
      variantQuantity: { type: String, required: true },
      variantRegularPrice: { type: String, required: true },
      variantSalePrice: { type: String, required: true },
      variantImagesFile: { type: Array, required: true },
      product: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Product',
      },
   },
   {
      timestamps: true,
   },
);
const ProductModel = mongoose.model<Product>('Product', ProductSchema);
const VariantModel = mongoose.model<Variant>('Variant', VariantSchema);

export { ProductModel, VariantModel };
