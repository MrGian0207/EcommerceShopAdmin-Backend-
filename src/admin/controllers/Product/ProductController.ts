import { create } from 'domain'
import { Request, Response } from 'express'

import { Product, productPayload, Variant } from '../../../types/ProductType'
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
      console.log(payload)
      console.log(variantImages)

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
      console.log(req.body)
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
        console.log(product)
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
      } = req.body

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
      ]

      if (requiredFields.some((field) => !field)) {
        return res.status(400).json({
          status: 'Error',
          message: 'Missing required fields',
        })
      }

      // Xử lý get idVariantArray và idVariantDeletedArray
      let idArray: string[] = []
      let idDeletedArray: string[] = []
      if (typeof idVariantArray === 'string' && idVariantArray !== undefined) {
        idArray = [idVariantArray]
      } else {
        idArray = idVariantArray
      }
      let VariantName: string[] = []
      if (typeof variantName === 'string') {
        VariantName = [variantName]
      } else {
        VariantName = variantName
      }

      if (typeof idVariantDeletedArray === 'string' && idVariantDeletedArray !== undefined) {
        idDeletedArray = [idVariantDeletedArray]
      } else {
        idDeletedArray = idVariantDeletedArray
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
        tags,
        featureProduct,
        defaultVariant,
      })

      if (product) {
        if (idDeletedArray !== undefined) {
          await VariantModel.deleteMany({
            _id: {
              $in: idDeletedArray,
            },
          })
        }

        let variantNumberImagesOfVariantArray: number[] = []
        if (variantNumberImagesOfVariants) {
          variantNumberImagesOfVariantArray = (variantNumberImagesOfVariants as string)
            .trim()
            .split(' ')
            .map((numberImages) => Number.parseInt(numberImages))
        }

        if (idArray !== undefined) {
          // Case: Có idArray thì update variant và thêm những variant mới từ phía client gửi (nếu có)
          try {
            for (let index = 0; index < VariantName?.length; index++) {
              // Lấy ra những image có thay đổi hoặc update
              let imagesFileVariant: string[] = []
              for (let i = 0; i < variantNumberImagesOfVariantArray[index]; i++) {
                if (variantImages && Array.isArray(variantImages)) {
                  const imageUrl = await cloudinary.uploader.upload(variantImages[0]?.path, {
                    folder: 'variant',
                  })
                  imagesFileVariant.push(imageUrl.secure_url)

                  variantImages?.splice(0, 1)
                }
              }
              // Update đối với những variant đã tồn tại trong DB
              if (index <= idArray.length - 1) {
                // lấy ra những hình ảnh đã được upload trên db của variant.
                let uploadedImage: string[] = []
                const variantUpdated = await VariantModel.findById({
                  _id: idArray[index],
                })
                if (variantUpdated) {
                  uploadedImage = variantUpdated.variantImages as string[]
                }

                const variant = await VariantModel.findOneAndUpdate(
                  {
                    _id: idArray[index],
                  },
                  {
                    variantName: VariantName[index],
                    variantSize: typeof variantSize === 'string' ? variantSize : variantSize[index],
                    variantColor:
                      typeof variantColor === 'string' ? variantColor : variantColor[index],
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
                  }
                )

                // check Variant đã được update hay chưa.
                if (!variant) {
                  return res.status(404).json({
                    status: 'Error',
                    message: 'Variant has not been updated successfully',
                  })
                }
              } else {
                // Tạo variant mới được thêm vào từ phía client
                const variant = new VariantModel({
                  variantName: VariantName[index],
                  variantSize: typeof variantSize === 'string' ? variantSize : variantSize[index],
                  variantColor:
                    typeof variantColor === 'string' ? variantColor : variantColor[index],
                  variantProductSKU:
                    typeof variantProductSKU === 'string'
                      ? variantProductSKU
                      : variantProductSKU[index],
                  variantQuantity:
                    typeof variantQuantity === 'string' ? variantQuantity : variantQuantity[index],
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
                })

                await variant.save()

                await product.updateOne({
                  $push: { variants: variant._id },
                })
              }
            }
          } catch (error) {
            console.log(error)
          }
        } else {
          // Case: Không có idArray thì thêm những variant mới từ phía client gửi
          for (let index = 0; index < VariantName?.length; index++) {
            try {
              // Lấy ra những image có thay đổi hoặc update
              let imagesFileVariant: string[] = []
              for (let i = 0; i < variantNumberImagesOfVariantArray[index]; i++) {
                if (variantImages && Array.isArray(variantImages)) {
                  const imageUrl = await cloudinary.uploader.upload(variantImages[0]?.path, {
                    folder: 'variant',
                  })
                  imagesFileVariant.push(imageUrl.secure_url)

                  variantImages?.splice(0, 1)
                }
              }
              const variant = new VariantModel({
                variantName: VariantName[index],
                variantSize: typeof variantSize === 'string' ? variantSize : variantSize[index],
                variantColor: typeof variantColor === 'string' ? variantColor : variantColor[index],
                variantProductSKU:
                  typeof variantProductSKU === 'string'
                    ? variantProductSKU
                    : variantProductSKU[index],
                variantQuantity:
                  typeof variantQuantity === 'string' ? variantQuantity : variantQuantity[index],
                variantRegularPrice:
                  typeof variantRegularPrice === 'string'
                    ? variantRegularPrice
                    : variantRegularPrice[index],
                variantSalePrice:
                  typeof variantSalePrice === 'string' ? variantSalePrice : variantSalePrice[index],
                variantImagesFile: imagesFileVariant,
                product: product._id,
              })

              await variant.save()

              await product.updateOne({
                $push: { variants: variant._id },
              })
            } catch (error) {
              console.log(error)
              return res.status(500).json({
                status: 'Error',
                message: 'Error creating product',
              })
            }
          }
        }
      }

      return res.status(200).json({
        status: 'Success',
        message: 'Product updated successfully',
      })
    } catch (error) {
      console.log(error)
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
