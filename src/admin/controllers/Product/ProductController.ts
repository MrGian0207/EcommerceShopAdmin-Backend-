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
                variantNumberImagesOfVariants,
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
                !variantNumberImagesOfVariants
            ) {
                return res.status(400).json({
                    status: 'Error',
                    message: 'Missing required fields',
                });
            }

            const variantNumberImagesOfVariantArray: number[] = (
                variantNumberImagesOfVariants as string
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
                (variantName as string[]).forEach(async (name, index) => {
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
                            variantName: name,
                            variantSize: variantSize[index],
                            variantColor: variantColor[index],
                            variantProductSKU: variantProductSKU[index],
                            variantQuantity: variantQuantity[index],
                            variantRegularPrice: variantRegularPrice[index],
                            variantSalePrice: variantSalePrice[index],
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

    async getOne(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const product = await ProductModel.findById(id).populate(
                'variants',
            );
            if (product) {
                return res.status(200).json({
                    status: 'Success',
                    data: product,
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: 'Error fetching product',
            });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
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
                variantNumberImagesOfVariants,
            } = req.body;
            const variantImages = req.files;
            console.log(variantImages);
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
                !variantNumberImagesOfVariants
            ) {
                return res.status(400).json({
                    status: 'Error',
                    message: 'Missing required fields',
                });
            }

            const product = await ProductModel.findByIdAndUpdate(id, {
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
                const variantNumberImagesOfVariantArray: number[] = (
                    variantNumberImagesOfVariants as string
                )
                    .trim()
                    .split(' ')
                    .map((numberImages) => Number.parseInt(numberImages));

                variantName &&
                    (variantName as string[]).forEach(async (name, index) => {
                        try {
                            if (
                                variantImages?.length &&
                                (variantImages as [])?.length > 0
                            ) {
                                let imagesFileVariant: string[] = [];
                                for (
                                    let i = 0;
                                    i <
                                    variantNumberImagesOfVariantArray[index];
                                    i++
                                ) {
                                    if (
                                        variantImages &&
                                        Array.isArray(variantImages)
                                    ) {
                                        const imageUrl =
                                            await cloudinary.uploader.upload(
                                                variantImages[0]?.path,
                                                {
                                                    folder: 'variant',
                                                },
                                            );
                                        imagesFileVariant.push(
                                            imageUrl.secure_url,
                                        );

                                        variantImages?.splice(0, 1);
                                    }
                                }

                                const variantIsExisted =
                                    await VariantModel.findOne({
                                        variantName: name,
                                    });
                                if (!variantIsExisted) {
                                    const variant = new VariantModel({
                                        variantName: name,
                                        variantSize: variantSize[index],
                                        variantColor: variantColor[index],
                                        variantProductSKU:
                                            variantProductSKU[index],
                                        variantQuantity: variantQuantity[index],
                                        variantRegularPrice:
                                            variantRegularPrice[index],
                                        variantSalePrice:
                                            variantSalePrice[index],
                                        variantImagesFile: imagesFileVariant,
                                        product: product._id,
                                    });

                                    await variant.save();

                                    await product.updateOne({
                                        $push: { variants: variant._id },
                                    });
                                } else {
                                    const variant =
                                        await VariantModel.findOneAndUpdate(
                                            { variantName: name },
                                            {
                                                variantName: name,
                                                variantSize: variantSize[index],
                                                variantColor:
                                                    variantColor[index],
                                                variantProductSKU:
                                                    variantProductSKU[index],
                                                variantQuantity:
                                                    variantQuantity[index],
                                                variantRegularPrice:
                                                    variantRegularPrice[index],
                                                variantSalePrice:
                                                    variantSalePrice[index],
                                                variantImagesFile:
                                                    imagesFileVariant,
                                            },
                                        );
                                    if (!variant) {
                                        return res.status(500).json({
                                            status: 'Error',
                                            message: 'Error processing variant',
                                        });
                                    }
                                }
                            } else {
                                const variant =
                                    await VariantModel.findOneAndUpdate(
                                        { variantName: name },
                                        {
                                            variantName: name,
                                            variantSize: variantSize[index],
                                            variantColor: variantColor[index],
                                            variantProductSKU:
                                                variantProductSKU[index],
                                            variantQuantity:
                                                variantQuantity[index],
                                            variantRegularPrice:
                                                variantRegularPrice[index],
                                            variantSalePrice:
                                                variantSalePrice[index],
                                        },
                                    );
                                if (!variant) {
                                    return res.status(500).json({
                                        status: 'Error',
                                        message: 'Error processing variant',
                                    });
                                }
                            }
                        } catch (error) {
                            return res.status(500).json({
                                status: 'Error',
                                message: 'Error processing variant',
                            });
                        }
                    });
            }

            return res.status(200).json({
                status: 'Success',
                message: 'Product updated successfully',
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: 'Error processing variant',
            });
        }
    }
}

export default ProductController;
