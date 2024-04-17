import { Request, Response } from 'express';
import { ProductModel, VariantModel } from '../../models/ProductModel';
import cloudinary from '../../../utils/cloudinary';

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

class ProductController {
    async store(req: Request, res: Response) {
        try {
            const {
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
                variantNumberImagesOfVariant,
            } = req.body;
            const variantImages = req.files;

            if (
                !name ||
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
                !variantNumberImagesOfVariant
            ) {
                return res.status(400).json({
                    status: 'Error',
                    message: 'Missing required fields',
                });
            }

            const variantNameArray: string[] = (variantName as string)
                .trim()
                .slice(0, -1)
                .split('-')
                .map((name) => name.replace(/"/g, ' ').trim());

            const variantSizeArray: string[] = (variantSize as string)
                .trim()
                .slice(0, -1)
                .split('-')
                .map((size) => size.replace(/"/g, ' ').trim());

            const variantColorArray: string[] = (variantColor as string)
                .trim()
                .slice(0, -1)
                .split('-')
                .map((color) => color.replace(/"/g, ' ').trim());

            const variantProductSKUArray: string[] = (
                variantProductSKU as string
            )
                .trim()
                .split(' ');

            const variantQuantityArray: string[] = (variantQuantity as string)
                .trim()
                .split(' ');

            const variantRegularPriceArray: string[] = (
                variantRegularPrice as string
            )
                .trim()
                .split(' ');

            const variantSalePriceArray: string[] = (variantSalePrice as string)
                .trim()
                .split(' ');

            const variantNumberImagesOfVariantArray: number[] = (
                variantNumberImagesOfVariant as string
            )
                .trim()
                .split(' ')
                .map((numberImages) => Number.parseInt(numberImages));

            const product = new ProductModel({
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
                variantNameArray.forEach(async (variantName, index) => {
                    try {
                        let imagesFileVariant: string[] = [];
                        for (
                            let i = 0;
                            i < variantNumberImagesOfVariantArray[index];
                            i++
                        ) {
                            if (variantImages && Array.isArray(variantImages)) {
                                const imageUrl =
                                    await cloudinary.uploader.upload(
                                        variantImages[0]?.path,
                                        {
                                            folder: 'variant',
                                        },
                                    );
                                imagesFileVariant.push(imageUrl.secure_url);

                                variantImages?.splice(0, 1);
                            }
                        }
                        const variant = new VariantModel({
                            variantName: variantName,
                            variantSize: variantSizeArray[index],
                            variantColor: variantColorArray[index],
                            variantProductSKU: variantProductSKUArray[index],
                            variantQuantity: variantQuantityArray[index],
                            variantRegularPrice:
                                variantRegularPriceArray[index],
                            variantSalePrice: variantSalePriceArray[index],
                            variantImagesFile: imagesFileVariant,
                            product: product._id,
                        });

                        await variant.save();

                        await product.updateOne({
                            $push: { variants: variant._id },
                        });
                    } catch (error) {
                        return res.status(500).json({
                            status: 'Error',
                            message: 'Error processing variant',
                        });
                    }
                });

            await product.save();
            return res.json({
                status: 'Success',
                message: 'Save Product Successfully !!',
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: 'Error creating product',
            });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const products = await ProductModel.find();
            let variants: Variant[] = [];
            let quantity: number[] = [];

            await Promise.all(
                products.map(async (product, index) => {
                    const variantDefault: Variant = (await VariantModel.findOne(
                        {
                            variantName: product.defaultVariant,
                        },
                    )) as Variant;
                    if (variants) {
                        variants[index] = variantDefault;
                    }

                    const variantArray: Variant[] = await VariantModel.find({
                        product: product._id,
                    });

                    if (quantity && variantArray.length > 0) {
                        const totalQuantity = variantArray.reduce(
                            (acc, variant) =>
                                acc + parseInt(variant.variantQuantity || '0'),
                            0,
                        );
                        quantity[index] = totalQuantity;
                    }
                }),
            );

            if (products.length > 0) {
                return res.status(200).json({
                    status: 'Success',
                    data: products,
                    variants: variants,
                    quantity: quantity,
                });
            } else {
                return res.status(404).json({
                    status: 'Error',
                    message: 'Products not found',
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: 'Error fetching products',
            });
        }
    }

    async activeProducts(req: Request, res: Response) {
        try {
            const update: { _id?: string; feature: string } = req.body;
            const product = await ProductModel.findByIdAndUpdate(update._id, {
                featureProduct: update.feature,
            });

            if (product) {
                return res.status(200).json({
                    status: 'Success',
                    message: `${product?.name} active successfully`,
                });
            } else {
                return res.status(404).json({
                    status: 'Error',
                    message: 'Product not found',
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: 'Error activating product',
            });
        }
    }
}

export default ProductController;
