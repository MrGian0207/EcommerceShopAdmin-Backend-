import mongoose, { Schema } from 'mongoose';

interface Variant {
  variantName?: string;
  variantSize?: string;
  variantColor?: string;
  variantProductSKU?: string;
  variantQuantity?: string;
  variantRegularPrice?: string;
  variantSalePrice?: string;
  variantImagesFile?: string[];
  product?: Product;
}

interface Product {
  name?: string;
  title?: string;
  slug?: string;
  description?: string;
  category?: string;
  subCategory?: string;
  brand?: string;
  gender?: string;
  status?: string;
  productCode?: string;
  tag?: string;
  featureProduct?: string;
  defaultVariant?: string;
  variants?: Variant[];
}

interface Order {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  methodDelivery?: string;
  statusDelivery?: string;
  shippingFee?: number;
  imageDefault?: string;
  colorProducts?: string[];
  quantityProducts?: number[];
  sizeProducts?: string[];
  priceProducts?: number[];
  subtotal?: number;
  total?: number;
  products?: Product[];
}

const OrderSchema = new Schema<Order>(
  {
    customerName: { type: 'String', required: true },
    customerPhone: { type: 'String', required: true },
    customerEmail: { type: 'String', required: true },
    customerAddress: { type: 'String', required: true },
    methodDelivery: { type: 'String', required: true },
    statusDelivery: { type: 'String', required: true },
    shippingFee: { type: 'Number', required: true },
    imageDefault: { type: 'String' },
    colorProducts: [{ type: 'String', required: true }],
    quantityProducts: [{ type: 'Number', required: true }],
    sizeProducts: [{ type: 'String', required: true }],
    priceProducts: [{ type: 'Number', required: true }],
    subtotal: { type: 'Number', required: true },
    total: { type: 'Number', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  {
    timestamps: true,
  },
);

const OrdersModel = mongoose.model<Order>('Order', OrderSchema);

export default OrdersModel;
