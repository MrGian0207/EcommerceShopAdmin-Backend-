import mongoose, { Schema } from 'mongoose'

import { Order } from '../../types/OrderType'

const OrderSchema = new Schema<Order>(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerAddress: { type: String, required: true },
    methodDelivery: { type: String, required: true },
    statusDelivery: { type: String, required: true },
    shippingFee: { type: Number, required: true },
    image: { type: String },
    colorProducts: [{ type: String, required: true }],
    quantityProducts: [{ type: Number, required: true }],
    sizeProducts: [{ type: String, required: true }],
    priceProducts: [{ type: Number, required: true }],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    variantIDs: { type: [String] },
  },
  {
    timestamps: true,
  }
)

const OrdersModel = mongoose.model<Order>('Order', OrderSchema)

export default OrdersModel
