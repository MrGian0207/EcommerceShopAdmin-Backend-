import { UploadApiResponse } from 'cloudinary'
import { Request, Response } from 'express'

import cloudinary from '../../../utils/cloudinary'
import MainCategoriesModel from '../../models/MainCategoriesModel'
import { ProductModel } from '../../models/ProductModel'
import { MainCategories } from './../../../types/MainCategoriesType'

type TotalProductArrayType = {
  name: string
  total: number
}

class AddMainCategoriesController {
  async store(req: Request, res: Response) {
    try {
      const { name, title, slug, description } = req.body
      const image = req.file

      // Kiểm tra các trường bắt buộc
      if (!name || !title || !slug || !description || !image) {
        return res.status(400).json({
          status: 'Error',
          message: 'Missing required fields',
        })
      }

      // Tải lên hình ảnh lên Cloudinary
      const imageUrl = await cloudinary.uploader.upload(image.path, {
        folder: 'mainCategories',
      })

      // Kiểm tra nếu hình ảnh không tải lên thành công
      if (!imageUrl || !imageUrl.secure_url) {
        return res.status(400).json({
          status: 'Error',
          message: 'Failed to upload image',
        })
      }

      // Tạo đối tượng MainCategoriesModel
      const mainCategories = new MainCategoriesModel({
        name: name.trim(),
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        image: imageUrl.secure_url,
      })

      // Lưu đối tượng vào cơ sở dữ liệu
      await mainCategories.save()

      // Trả về kết quả thành công
      return res.status(200).json({
        status: 'Success',
        message: 'Main Categories have been saved successfully !!!',
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      })
    }
  }

  async getAll(req: Request, res: Response) {
    const page: string = (req.query?.page as string) ? (req.query?.page as string) : '1'
    const search: string = req.query?.search as string
    const brandsPerPage: number = 10
    let numberOfMainCategories: number = 0
    await MainCategoriesModel.countDocuments({}).then((countDocuments) => {
      numberOfMainCategories = Math.ceil(countDocuments / brandsPerPage)
    })

    const mainCategories = await MainCategoriesModel.find({
      name: { $regex: search, $options: 'i' },
    })
      .skip((parseInt(page) - 1) * brandsPerPage)
      .limit(brandsPerPage)

    let productArray: TotalProductArrayType[] = []
    for (let i: number = 0; i < mainCategories.length; i++) {
      await ProductModel.countDocuments({
        category: mainCategories[i].name,
      }).then((countDocuments) => {
        const name: string = mainCategories[i]?.name as string
        productArray.push({ name, total: countDocuments })
      })
    }

    if (mainCategories) {
      const data = mainCategories.map((mainCategory, index) => {
        const categoryObject = mainCategory.toObject()
        return {
          ...categoryObject,
          totalProducts: productArray[index].total,
        }
      })
      return res.status(200).json({ data, numbers: numberOfMainCategories })
    } else {
      return res.status(404).json({
        status: 'Error',
        message: 'Main Categories not found',
      })
    }
  }

  async getOne(req: Request, res: Response) {
    const { id } = req.params
    const mainCategory = await MainCategoriesModel.findById(id)
    if (mainCategory) {
      return res.status(200).json({
        status: 'Success',
        data: mainCategory,
      })
    } else {
      return res.status(404).json({
        status: 'Error',
        message: 'Main Categories not found',
      })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, title, slug, description } = req.body
      const image = req.file
      let imageUrl: UploadApiResponse

      if (!name || !title || !slug || !description) {
        return res.status(400).json({
          status: 'Error',
          message: 'Missing required fields',
        })
      }

      const mainCategory = await MainCategoriesModel.findById(id)

      if (image) {
        const deletedImage: string = mainCategory?.image as string
        const publicIdRegex = /\/mainCategories\/([^/.]+)/
        const matches = deletedImage.match(publicIdRegex)

        await cloudinary.uploader.destroy(
          `mainCategories/${matches && matches[1]}`,
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

        imageUrl = await cloudinary.uploader.upload(image.path, {
          folder: 'mainCategories',
        })

        if (mainCategory) {
          ;(mainCategory.name = name.trim()),
            (mainCategory.title = title.trim()),
            (mainCategory.slug = slug.trim()),
            (mainCategory.description = description.trim()),
            (mainCategory.image = imageUrl ? imageUrl.secure_url : '')

          mainCategory?.save()

          // Trả về kết quả thành công
          return res.status(200).json({
            status: 'Success',
            message: 'Main Categories have been updated successfully !!!',
          })
        }
      } else {
        if (mainCategory) {
          ;(mainCategory.name = name.trim()),
            (mainCategory.title = title.trim()),
            (mainCategory.slug = slug.trim()),
            (mainCategory.description = description.trim()),
            mainCategory?.save()

          // Trả về kết quả thành công
          return res.status(200).json({
            status: 'Success',
            message: 'Main Categories have been updated successfully !!!',
          })
        }
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
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
      const mainCategory = await MainCategoriesModel.findById(id)
      if (mainCategory) {
        const deletedImage: string = mainCategory?.image as string
        const publicIdRegex = /\/mainCategories\/([^/.]+)/
        const matches = deletedImage.match(publicIdRegex)

        await cloudinary.uploader.destroy(
          `mainCategories/${matches && matches[1]}`,
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

        await mainCategory?.deleteOne()
        const confirmDelete = await MainCategoriesModel.findById(id)
        if (confirmDelete) {
          return res.status(404).json({
            status: 'Error',
            message: 'Main Categories not found',
          })
        } else {
          return res.status(200).json({
            status: 'Success',
            message: 'Main Categories have been deleted successfully !!!',
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

  async categories(req: Request, res: Response) {
    const nameMainCategories = await MainCategoriesModel.distinct('name')
    if (nameMainCategories) {
      return res.status(200).json({
        status: 'Success',
        data: nameMainCategories.map((name) => {
          return {
            value: name,
            label: name,
          }
        }),
      })
    } else {
      return res.status(404).json({
        status: 'Error',
        message: 'Main Categories not found',
      })
    }
  }
}

export default AddMainCategoriesController
