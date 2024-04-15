import { Request, Response } from 'express';
import { ProductModel, VariantModel } from '../../models/ProductModel';
import cloudinary from '../../../utils/cloudinary';

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
                            variantRegularPrice: variantRegularPriceArray[index],
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
}

export default ProductController;
