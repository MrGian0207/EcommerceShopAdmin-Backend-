import { Request, Response } from 'express';
import { ProductModel, VariantModel } from '../../models/ProductModel';
import cloudinary from '../../../utils/cloudinary';
import mongoose from 'mongoose';

interface Variant {
  _id?: string;
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

      // Kiểm tra các trường bắt buộc
      const requiredFields = [
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
      ];

      if (requiredFields.some((field) => !field)) {
        return res.status(400).json({
          status: 'Error',
          message: 'Missing required fields',
        });
      }

      let VariantName: string[] = [];
      if (typeof variantName === 'string') {
        VariantName = [variantName];
      } else {
        VariantName = variantName;
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

      await product.save();

      if (variantName) {
        for (let index = 0; index < VariantName.length; index++) {
          try {
            let imagesFileVariant: string[] = [];
            for (let i = 0; i < variantNumberImagesOfVariantArray[index]; i++) {
              if (variantImages && Array.isArray(variantImages)) {
                const imageUrl = await cloudinary.uploader.upload(
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
              variantName:
                typeof variantName[index] === 'string'
                  ? variantName
                  : variantName[index],
              variantSize:
                typeof variantSize[index] === 'number'
                  ? variantSize
                  : variantSize[index],
              variantColor:
                typeof variantColor[index] === 'string'
                  ? variantColor
                  : variantColor[index],
              variantProductSKU:
                typeof variantProductSKU[index] === 'string'
                  ? variantProductSKU
                  : variantProductSKU[index],
              variantQuantity:
                typeof variantQuantity[index] === 'string'
                  ? variantQuantity
                  : variantQuantity[index],
              variantRegularPrice:
                typeof variantRegularPrice[index] === 'string'
                  ? variantRegularPrice
                  : variantRegularPrice[index],
              variantSalePrice:
                typeof variantSalePrice[index] === 'string'
                  ? variantSalePrice
                  : variantSalePrice[index],
              variantImagesFile:
                imagesFileVariant?.length > 0 ? imagesFileVariant : [],
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
        }
      }

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
      const page: string = (req.query?.page as string)
        ? (req.query?.page as string)
        : '1';
      const search: string = req.query?.search as string;
      const brandsPerPage: number = 10;
      let numberOfProducts: number = 0;
      await ProductModel.countDocuments({}).then((countDocuments) => {
        numberOfProducts = Math.ceil(countDocuments / brandsPerPage);
      });
      const products = await ProductModel.find({
        name: { $regex: search, $options: 'i' },
      })
        .skip((parseInt(page) - 1) * brandsPerPage)
        .limit(brandsPerPage);
      let variants: Variant[] = [];
      let quantity: number[] = [];

      await Promise.all(
        products.map(async (product, index) => {
          const variantDefault: Variant = (await VariantModel.findOne({
            variantName: product.defaultVariant,
          })) as Variant;
          if (variants) {
            variants[index] = variantDefault;
          }

          const variantArray: Variant[] = await VariantModel.find({
            product: product._id,
          });

          if (quantity && variantArray.length > 0) {
            const totalQuantity = variantArray.reduce(
              (acc, variant) => acc + parseInt(variant.variantQuantity || '0'),
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
          numbers: numberOfProducts,
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
          message: `${product?.name} ${
            product?.featureProduct === 'active' ? 'Inactive' : 'Active'
          } successfully`,
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

      const product = await ProductModel.findById(id).populate('variants');
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
      let {
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
        idVariantArray,
        idVariantDeletedArray,
      } = req.body;

      const variantImages = req.files;

      // Kiểm tra các trường bắt buộc
      const requiredFields = [
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
      ];

      if (requiredFields.some((field) => !field)) {
        return res.status(400).json({
          status: 'Error',
          message: 'Missing required fields',
        });
      }

      // Xử lý get idVariantArray và idVariantDeletedArray
      let idArray: string[] = [];
      let idDeletedArray: string[] = [];
      if (typeof idVariantArray === 'string' && idVariantArray !== undefined) {
        idArray = [idVariantArray];
      } else {
        idArray = idVariantArray;
      }
      let VariantName: string[] = [];
      if (typeof variantName === 'string') {
        VariantName = [variantName];
      } else {
        VariantName = variantName;
      }

      if (
        typeof idVariantDeletedArray === 'string' &&
        idVariantDeletedArray !== undefined
      ) {
        idDeletedArray = [idVariantDeletedArray];
      } else {
        idDeletedArray = idVariantDeletedArray;
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
        if (idDeletedArray !== undefined) {
          await VariantModel.deleteMany({
            _id: {
              $in: idDeletedArray,
            },
          });
        }

        let variantNumberImagesOfVariantArray: number[] = [];
        if (variantNumberImagesOfVariants) {
          variantNumberImagesOfVariantArray = (
            variantNumberImagesOfVariants as string
          )
            .trim()
            .split(' ')
            .map((numberImages) => Number.parseInt(numberImages));
        }

        if (idArray !== undefined) {
          // Case: Có idArray thì update variant và thêm những variant mới từ phía client gửi (nếu có)
          try {
            for (let index = 0; index < VariantName?.length; index++) {
              // Lấy ra những image có thay đổi hoặc update
              let imagesFileVariant: string[] = [];
              for (
                let i = 0;
                i < variantNumberImagesOfVariantArray[index];
                i++
              ) {
                if (variantImages && Array.isArray(variantImages)) {
                  const imageUrl = await cloudinary.uploader.upload(
                    variantImages[0]?.path,
                    {
                      folder: 'variant',
                    },
                  );
                  imagesFileVariant.push(imageUrl.secure_url);

                  variantImages?.splice(0, 1);
                }
              }
              // Update đối với những variant đã tồn tại trong DB
              if (index <= idArray.length - 1) {
                // lấy ra những hình ảnh đã được upload trên db của variant.
                let uploadedImage: string[] = [];
                const variantUpdated = await VariantModel.findById({
                  _id: idArray[index],
                });
                if (variantUpdated) {
                  uploadedImage = variantUpdated.variantImagesFile as string[];
                }

                const variant = await VariantModel.findOneAndUpdate(
                  {
                    _id: idArray[index],
                  },
                  {
                    variantName: VariantName[index],
                    variantSize:
                      typeof variantSize === 'string'
                        ? variantSize
                        : variantSize[index],
                    variantColor:
                      typeof variantColor === 'string'
                        ? variantColor
                        : variantColor[index],
                    variantProductSKU:
                      typeof variantProductSKU === 'string'
                        ? variantProductSKU
                        : variantProductSKU[index],
                    variantQuantity:
                      typeof variantQuantity === 'string'
                        ? variantQuantity
                        : variantQuantity[index],
                    variantRegularPrice:
                      typeof variantRegularPrice === 'string'
                        ? variantRegularPrice
                        : variantRegularPrice[index],
                    variantSalePrice:
                      typeof variantSalePrice === 'string'
                        ? variantSalePrice
                        : variantSalePrice[index],
                    variantImagesFile:
                      imagesFileVariant?.length > 0
                        ? imagesFileVariant.concat(uploadedImage)
                        : uploadedImage,
                  },
                );

                // check Variant đã được update hay chưa.
                if (!variant) {
                  return res.status(404).json({
                    status: 'Error',
                    message: 'Variant has not been updated successfully',
                  });
                }
              } else {
                // Tạo variant mới được thêm vào từ phía client
                const variant = new VariantModel({
                  variantName: VariantName[index],
                  variantSize:
                    typeof variantSize === 'string'
                      ? variantSize
                      : variantSize[index],
                  variantColor:
                    typeof variantColor === 'string'
                      ? variantColor
                      : variantColor[index],
                  variantProductSKU:
                    typeof variantProductSKU === 'string'
                      ? variantProductSKU
                      : variantProductSKU[index],
                  variantQuantity:
                    typeof variantQuantity === 'string'
                      ? variantQuantity
                      : variantQuantity[index],
                  variantRegularPrice:
                    typeof variantRegularPrice === 'string'
                      ? variantRegularPrice
                      : variantRegularPrice[index],
                  variantSalePrice:
                    typeof variantSalePrice === 'string'
                      ? variantSalePrice
                      : variantSalePrice[index],
                  variantImagesFile: imagesFileVariant,
                  product: product._id,
                });

                await variant.save();

                await product.updateOne({
                  $push: { variants: variant._id },
                });
              }
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          // Case: Không có idArray thì thêm những variant mới từ phía client gửi
          for (let index = 0; index < VariantName?.length; index++) {
            try {
              // Lấy ra những image có thay đổi hoặc update
              let imagesFileVariant: string[] = [];
              for (
                let i = 0;
                i < variantNumberImagesOfVariantArray[index];
                i++
              ) {
                if (variantImages && Array.isArray(variantImages)) {
                  const imageUrl = await cloudinary.uploader.upload(
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
                variantName: VariantName[index],
                variantSize:
                  typeof variantSize === 'string'
                    ? variantSize
                    : variantSize[index],
                variantColor:
                  typeof variantColor === 'string'
                    ? variantColor
                    : variantColor[index],
                variantProductSKU:
                  typeof variantProductSKU === 'string'
                    ? variantProductSKU
                    : variantProductSKU[index],
                variantQuantity:
                  typeof variantQuantity === 'string'
                    ? variantQuantity
                    : variantQuantity[index],
                variantRegularPrice:
                  typeof variantRegularPrice === 'string'
                    ? variantRegularPrice
                    : variantRegularPrice[index],
                variantSalePrice:
                  typeof variantSalePrice === 'string'
                    ? variantSalePrice
                    : variantSalePrice[index],
                variantImagesFile: imagesFileVariant,
                product: product._id,
              });

              await variant.save();

              await product.updateOne({
                $push: { variants: variant._id },
              });
            } catch (error) {
              console.log(error);
              return res.status(500).json({
                status: 'Error',
                message: 'Error creating product',
              });
            }
          }
        }
      }

      return res.status(200).json({
        status: 'Success',
        message: 'Product updated successfully',
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'Error',
        message: 'Error processing variant',
      });
    }
  }

  async deleteOne(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          status: 'Error',
          message: 'Missing required fields',
        });
      }

      const product = await ProductModel.findById(id);
      if (product) {
        const variants: Variant[] = await VariantModel.find({
          product: id,
        });

        for (let index = 0; index < variants.length; index++) {
          // Lấy tất cả các ảnh trong variant
          const deletedImageArray: string[] = variants[index]
            .variantImagesFile as string[];

          // Xóa hết tất cả các ảnh đó ở trên Cloudinary
          for (let i = 0; i < deletedImageArray?.length; i++) {
            const deletedImage: string = deletedImageArray[i];
            const pulicRegex = /\/variant\/([^/.]+)/;
            const matches = deletedImage.match(pulicRegex);
            await cloudinary.uploader.destroy(
              `variant/${matches && matches[1]}`,
              (error, result) => {
                if (error) {
                  console.error('Failed to delete image:', error);
                  // Xử lý lỗi
                } else {
                  console.log('Image deleted successfully:', result);
                  // Xử lý khi xóa thành công
                }
              },
            );
          }
        }
        // Xóa hết tất cả variant trong product
        try {
          await VariantModel.deleteMany({ product: id });
          console.log('Đã xóa thành công');
        } catch (error) {
          console.log(error);
        }

        // Confirm delete variants and product
        const variantsIsDeleted = await VariantModel.find({
          product: id,
        });

        // Confirm variants is deleated and delete Product
        if (variantsIsDeleted) {
          await ProductModel.deleteOne({ _id: id });
          return res.status(200).json({
            status: 'Success',
            message: 'Product deleted successfully',
          });
        } else {
          return res.status(404).json({
            status: 'Error',
            message: 'Product has not been deleted successfully',
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      });
    }
  }
}

export default ProductController;
