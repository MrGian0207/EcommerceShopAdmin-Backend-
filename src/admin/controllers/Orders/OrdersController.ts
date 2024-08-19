import { Request, Response } from 'express';
import OrdersModel from '../../models/OrdersModel';
import { VariantModel } from '../../models/ProductModel';
import { Product, Variant } from './../../../types/ProductType';

class OrdersController {
   async store(req: Request, res: Response) {
      const {
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
      } = req.body;

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
         const variant = await VariantModel.find({
            product: products[0],
         });

         const order = new OrdersModel({
            customerName: customerName,
            customerPhone: customerPhone,
            customerEmail: customerEmail,
            customerAddress: customerAddress,
            methodDelivery: methodDelivery,
            statusDelivery: statusDelivery,
            shippingFee: shippingFee,
            // imageDefault: variant[0]
            //    ? (variant[0] as Variant).variantImagesFile?.[0]
            //    : '',
            colorProducts: colorProducts,
            quantityProducts: quantityProducts,
            sizeProducts: sizeProducts,
            priceProducts: priceProducts,
            subtotal: subtotal,
            total: total,
            products: products,
         });

         await order.save();
         console.log('Tao thanh cong');
         return res.status(200).json({
            status: 'Success',
            message: 'Order was successfully',
         });
      } catch (error) {
         console.log(error);
         return res.status(404).json({
            status: 'Error',
            message: 'Orders have not been created',
         });
      }
   }

   async getAll(req: Request, res: Response) {
      try {
         const page: string = (req.query?.page as string)
            ? (req.query?.page as string)
            : '1';
         const brandsPerPage: number = 10;
         const search: string = req.query?.search as string;
         let numberOfOrders: number = 0;
         await OrdersModel.countDocuments({}).then((countDocuments) => {
            numberOfOrders = Math.ceil(countDocuments / brandsPerPage);
         });
         const orders = await OrdersModel.find({
            customerName: { $regex: search, $options: 'i' },
         })
            .skip((parseInt(page) - 1) * brandsPerPage)
            .limit(brandsPerPage);
         return res.json({
            status: 'Success',
            data: orders,
            numbers: numberOfOrders,
         });
      } catch (error) {
         console.log(error);
         return res.status(404).json({
            status: 'Error',
            message: ' Orders not founded',
         });
      }
   }

   async getOne(req: Request, res: Response) {
      try {
         const id = req.params.id;
         const order = await OrdersModel.findOne({ _id: id }).populate(
            'products',
         );
         const idProducts: string[] = order?.products?.map(
            (product: Product) => product._id,
         ) as string[];

         let imagesOfProduct: string[] = [];
         for (let index: number = 0; index < idProducts.length; index++) {
            const images: string[] = (await VariantModel.find({
               product: idProducts[index],
            }).distinct('variantImagesFile')) as string[];
            imagesOfProduct.push(images[0]);
         }

         return res.status(200).json({
            status: 'Success',
            data: { order, imagesOfProduct },
         });
      } catch (error) {
         console.log(error);
         return res.status(404).json({
            status: 'Error',
            message: 'Order not found',
         });
      }
   }

   async deleteOne(req: Request, res: Response) {
      try {
         const { id } = req.body;
         if (!id) {
            return res.status(400).json({
               status: 'Error',
               message: 'Missing required fields',
            });
         }
         const orderDeleted = await OrdersModel.findByIdAndDelete({ _id: id });
         if (orderDeleted) {
            return res.status(200).json({
               status: 'Success',
               message: 'Order deleted successfully',
            });
         }
      } catch (error) {
         console.log(error);
         res.status(404).json({
            status: 'Error',
            message: 'Order not deleted successfully',
         });
      }
   }

   async updateOne(req: Request, res: Response) {
      try {
         const id = req.params.id;
         const { statusOrder } = req.body;
         const order = await OrdersModel.findByIdAndUpdate(id, {
            statusDelivery: statusOrder as string,
         });

         if (order) {
            res.status(200).json({
               status: 'Success',
               message: 'Order updated status delivered successfully',
            });
         }
      } catch (error) {
         console.log(error);
         return res.status(404).json({
            status: 'Error',
            message: 'Order not updated successfully',
         });
      }
   }
}

export default OrdersController;
