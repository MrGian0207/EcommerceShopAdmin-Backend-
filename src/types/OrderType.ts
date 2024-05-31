import { Product } from "./ProductType";

export interface Order {
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