import { create } from 'domain'
import { Request, Response } from 'express'

import { productPayload, Variant } from '../../../types/ProductType'
import cloudinary from '../../../utils/cloudinary'
import { ProductModel, VariantModel } from '../../models/ProductModel'

class ProductController {
  async store(req: Request, res: Response) {
    try {
      const payload: productPayload = JSON.parse(req.body.payload)
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
        tags,
        featureProduct,
        defaultVariant,
        variants,
      } = payload
      const variantImages = req.files

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
        tags,
        featureProduct,
        defaultVariant,
        variants,
      ]

      if (requiredFields.some((field) => !field)) {
        return res.status(400).json({
          status: 'Error',
          message: 'Missing required fields',
        })
      }

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
        tags,
        featureProduct,
        defaultVariant,
      })

      await product.save()
      const variantPromises = variants.map(async (variant, index) => {
        try {
          let images: Express.Multer.File[] = []
          if (Array.isArray(variantImages)) {
            images = variantImages.slice(0, variant.numberOfImages)
            variantImages.splice(0, variant.numberOfImages)
          }

          const uploadPromises = images.map((image) =>
            cloudinary.uploader.upload(image.path, {
              folder: 'variant',
            })
          )

          const uploadedImages = await Promise.all(uploadPromises)

          const newVariant = new VariantModel({
            variantName: variant.variantName,
            variantSize: variant.variantSize,
            variantColor: variant.variantColor,
            variantProductSKU: variant.variantProductSKU,
            variantQuantity: variant.variantQuantity,
            variantRegularPrice: variant.variantRegularPrice,
            variantSalePrice: variant.variantSalePrice,
            variantImages: uploadedImages.map((img) => img.secure_url),
            product: product._id,
          })

          await newVariant.save()
          await product.updateOne({
            $push: { variants: newVariant._id },
          })
        } catch (err) {
          console.error('Error processing variant:', err)
          throw err
        }
      })

      await Promise.all(variantPromises)

      return res.json({
        status: 'Success',
        message: 'Save Product Successfully !!',
      })
    } catch (error) {
      return res.status(500).json({
        status: 'Error',
        message: 'Error creating product',
      })
    }
  }

  getAll(req: Request, res: Response) {
    try {
      const page: string = (req.query?.page as string) ? (req.query?.page as string) : '1'
      const search: string = req.query?.search as string
      const brandsPerPage: number = 10
      let numberOfProducts: number = 0

      ProductModel.countDocuments({}).then((countDocuments) => {
        numberOfProducts = Math.ceil(countDocuments / brandsPerPage)
      })

      ProductModel.find({
        name: { $regex: search, $options: 'i' },
      })
        .populate('variants')
        .skip((parseInt(page) - 1) * brandsPerPage)
        .limit(brandsPerPage)
        .then((products) => {
          const data = products.map((product) => {
            const productObject = product.toObject()
            const variantDefault = productObject.variants?.find(
              (variant) => variant.variantName === productObject.defaultVariant
            )
            const totalProducts = productObject.variants?.reduce(
              (total, variant) => (total + variant.variantQuantity) | 0,
              0
            )

            return {
              ...productObject,
              image: variantDefault?.variantImages?.[0],
              priceDefault: variantDefault?.variantRegularPrice,
              totalProducts,
            }
          })
          return res.status(200).json({ data: data, numbers: numberOfProducts })
        })
        .catch((err) => {
          return res.status(500).json({
            status: 'Error',
            message: err.message,
          })
        })
    } catch (error) {
      return res.status(500).json({
        status: 'Error',
        message: 'Error fetching products',
      })
    }
  }

  async activeProducts(req: Request, res: Response) {
    try {
      const update: { id: string; featureState: string } = req.body
      const product = await ProductModel.findByIdAndUpdate(update.id, {
        featureProduct: update.featureState,
      })

      if (product) {
        return res.status(200).json({
          message: 'Featured Product State updated successfully',
        })
      } else {
        return res.status(404).json({
          message: 'Product not found',
        })
      }
    } catch (error) {
      return res.status(500).json({
        message: 'Error activating product',
      })
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params

      const product = await ProductModel.findById(id).populate('variants')
      if (product) {
        return res.status(200).json(product)
      }
    } catch (error) {
      return res.status(500).json({
        status: 'Error',
        message: 'Error fetching product',
      })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const payload: productPayload = JSON.parse(req.body.payload)
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
        tags,
        featureProduct,
        defaultVariant,
        variants,
      } = payload

      console.log(payload)

      const variantImagesPayload = req.files
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
        tags,
        featureProduct,
        defaultVariant,
        variants,
      ]

      if (requiredFields.some((field) => !field)) {
        return res.status(400).json({
          status: 'Error',
          message: 'Missing required fields',
        })
      }

      // Cập nhật sản phẩm
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
        tags,
        featureProduct,
        defaultVariant,
      })

      if (!product) {
        return res.status(404).json({
          status: 'Error',
          message: 'Product not found',
        })
      }

      // Xử lý các variant
      const variantPromises = variants.map(async (variant) => {
        try {
          const imagesUpdated = variant.variantImages.filter((image) => image === 'newImage')

          if (imagesUpdated.length > 0) {
            let images: Express.Multer.File[] = []
            if (Array.isArray(variantImagesPayload)) {
              images = variantImagesPayload.slice(0, imagesUpdated.length)
              variantImagesPayload.splice(0, imagesUpdated.length)
            }

            const uploadPromises = images.map((image) =>
              cloudinary.uploader.upload(image.path, {
                folder: 'variant',
              })
            )

            const uploadedImages = await Promise.all(uploadPromises)

            await VariantModel.findOneAndUpdate(
              { variantID: variant.variantID },
              {
                variantName: variant.variantName,
                variantSize: variant.variantSize,
                variantColor: variant.variantColor,
                variantProductSKU: variant.variantProductSKU,
                variantQuantity: variant.variantQuantity,
                variantRegularPrice: variant.variantRegularPrice,
                variantSalePrice: variant.variantSalePrice,
                variantImages: [
                  ...variant.variantImages.filter((variantImage) => variantImage !== 'newImage'),
                  ...uploadedImages.map((img) => img.secure_url),
                ],
              }
            ).then(async (variantUpdated) => {
              if (!variantUpdated) {
                const uploadedImages = await Promise.all(uploadPromises)
                const newVariant = new VariantModel({
                  variantName: variant.variantName,
                  variantSize: variant.variantSize,
                  variantColor: variant.variantColor,
                  variantProductSKU: variant.variantProductSKU,
                  variantQuantity: variant.variantQuantity,
                  variantRegularPrice: variant.variantRegularPrice,
                  variantSalePrice: variant.variantSalePrice,
                  variantImages: uploadedImages.map((img) => img.secure_url),
                  product: id,
                })

                await newVariant.save()
                await product.updateOne({
                  $push: { variants: newVariant._id },
                })
              }
            })
          } else {
            await VariantModel.findOneAndUpdate(
              { variantID: variant.variantID },
              {
                variantName: variant.variantName,
                variantSize: variant.variantSize,
                variantColor: variant.variantColor,
                variantProductSKU: variant.variantProductSKU,
                variantQuantity: variant.variantQuantity,
                variantRegularPrice: variant.variantRegularPrice,
                variantSalePrice: variant.variantSalePrice,
                variantImages: [...variant.variantImages],
              }
            )
          }
        } catch (err) {
          // console.error('Error processing variant:', err)
          throw err
        }
      })

      await Promise.all(variantPromises)

      // Sau khi tất cả các variant đã được xử lý, gửi phản hồi thành công
      return res.status(200).json({
        status: 'Success',
        message: 'Product updated successfully',
      })
    } catch (error) {
      console.error('Error updating product:', error)
      return res.status(500).json({
        status: 'Error',
        message: 'Error processing variant',
      })
    }
  }

  async deleteOne(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!id) {
        return res.status(400).json({
          status: 'Error',
          message: 'Missing required fields',
        })
      }

      const product = await ProductModel.findById(id)
      if (product) {
        const variants: Variant[] = await VariantModel.find({
          product: id,
        })

        for (let index = 0; index < variants.length; index++) {
          // Lấy tất cả các ảnh trong variant
          const deletedImageArray: string[] = variants[index].variantImages as string[]

          // Xóa hết tất cả các ảnh đó ở trên Cloudinary
          for (let i = 0; i < deletedImageArray?.length; i++) {
            const deletedImage: string = deletedImageArray[i]
            const pulicRegex = /\/variant\/([^/.]+)/
            const matches = deletedImage.match(pulicRegex)
            await cloudinary.uploader.destroy(
              `variant/${matches && matches[1]}`,
              (error, result) => {
                if (error) {
                  console.error('Failed to delete image:', error)
                  // Xử lý lỗi
                } else {
                  console.log('Image deleted successfully:', result)
                  // Xử lý khi xóa thành công
                }
              }
            )
          }
        }
        // Xóa hết tất cả variant trong product
        try {
          await VariantModel.deleteMany({ product: id })
          console.log('Đã xóa thành công')
        } catch (error) {
          console.log(error)
        }

        // Confirm delete variants and product
        const variantsIsDeleted = await VariantModel.find({
          product: id,
        })

        // Confirm variants is deleated and delete Product
        if (variantsIsDeleted) {
          await ProductModel.deleteOne({ _id: id })
          return res.status(200).json({
            status: 'Success',
            message: 'Product deleted successfully',
          })
        } else {
          return res.status(404).json({
            status: 'Error',
            message: 'Product has not been deleted successfully',
          })
        }
      }
    } catch (error) {
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      })
    }
  }
}

export default ProductController
