import { Request, Response } from 'express';
import cloudinary from '../../../utils/cloudinary';
import SubCategoriesModel from '../../models/SubCategoriesModel';
import { UploadApiResponse } from 'cloudinary';

class SubCategoriesController {
  async store(req: Request, res: Response) {
    try {
      const { name, title, slug, description, category } = req.body;
      const image = req.file;

      // Kiểm tra các trường bắt buộc
      if (!name || !title || !slug || !description || !category || !image) {
        return res.status(400).json({
          status: 'Error',
          message: 'Missing required fields',
        });
      }

      // Tải lên hình ảnh lên Cloudinary
      const imageUrl = await cloudinary.uploader.upload(image.path, {
        folder: 'subCategories',
      });

      // Kiểm tra nếu hình ảnh không tải lên thành công
      if (!imageUrl || !imageUrl.secure_url) {
        return res.status(400).json({
          status: 'Error',
          message: 'Failed to upload image',
        });
      }

      // Tạo đối tượng SubCategoriesModel
      const subCategories = new SubCategoriesModel({
        name: name.trim(),
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        parentCategory: category.trim(),
        image: imageUrl.secure_url,
      });

      // Lưu đối tượng vào cơ sở dữ liệu
      await subCategories.save();

      // Trả về kết quả thành công
      return res.status(200).json({
        status: 'Success',
        message: 'Sub Categories have been saved successfully !!!',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      });
    }
  }

  async getAll(req: Request, res: Response) {
    const page: string = (req.query?.page as string)
      ? (req.query?.page as string)
      : '1';
    const brandsPerPage: number = 3;
    let numberOfSubCategories: number = 0;
    await SubCategoriesModel.countDocuments({}).then((countDocuments) => {
      numberOfSubCategories = Math.ceil(countDocuments / brandsPerPage);
    });
    const subCategories = await SubCategoriesModel.find()
      .skip((parseInt(page) - 1) * brandsPerPage)
      .limit(brandsPerPage);
    if (subCategories) {
      return res.status(200).json({
        status: 'Success',
        data: subCategories,
        numbers: numberOfSubCategories,
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        message: 'Sub Categories not found',
      });
    }
  }

  async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const subCategory = await SubCategoriesModel.findById(id);
    if (subCategory) {
      return res.status(200).json({
        status: 'Success',
        data: subCategory,
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        message: 'Sub Categories not found',
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, title, slug, description, category } = req.body;
      const image = req.file;
      let imageUrl: UploadApiResponse;

      if (!name || !title || !slug || !description || !category) {
        return res.status(400).json({
          status: 'Error',
          message: 'Missing required fields',
        });
      }

      const subCategory = await SubCategoriesModel.findById(id);

      if (image) {
        const deletedImage: string = subCategory?.image as string;
        const publicIdRegex = /\/subCategories\/([^/.]+)/;
        const matches = deletedImage.match(publicIdRegex);

        await cloudinary.uploader.destroy(
          `subCategories/${matches && matches[1]}`,
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

        imageUrl = await cloudinary.uploader.upload(image.path, {
          folder: 'subCategories',
        });

        if (subCategory) {
          (subCategory.name = name.trim()),
            (subCategory.title = title.trim()),
            (subCategory.slug = slug.trim()),
            (subCategory.description = description.trim()),
            (subCategory.parentCategory = category.trim()),
            (subCategory.image = imageUrl ? imageUrl.secure_url : '');

          subCategory?.save();

          // Trả về kết quả thành công
          return res.status(200).json({
            status: 'Success',
            message: 'Sub Categories have been updated successfully !!!',
          });
        }
      } else {
        if (subCategory) {
          (subCategory.name = name.trim()),
            (subCategory.title = title.trim()),
            (subCategory.slug = slug.trim()),
            (subCategory.description = description.trim()),
            (subCategory.parentCategory = category.trim()),
            subCategory?.save();

          // Trả về kết quả thành công
          return res.status(200).json({
            status: 'Success',
            message: 'Sub Categories have been updated successfully !!!',
          });
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
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
      const subCategory = await SubCategoriesModel.findById(id);
      if (subCategory) {
        const deletedImage: string = subCategory?.image as string;
        const publicIdRegex = /\/subCategories\/([^/.]+)/;
        const matches = deletedImage.match(publicIdRegex);

        await cloudinary.uploader.destroy(
          `subCategories/${matches && matches[1]}`,
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

        await subCategory?.deleteOne();
        const confirmDelete = await SubCategoriesModel.findById(id);
        if (confirmDelete) {
          return res.status(404).json({
            status: 'Error',
            message: 'Sub Categories not found',
          });
        } else {
          return res.status(200).json({
            status: 'Success',
            message: 'Sub Categories have been deleted successfully !!!',
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

  async subCategories(req: Request, res: Response) {
    const nameSubCategories = await SubCategoriesModel.distinct('name');
    if (nameSubCategories) {
      return res.status(200).json({
        status: 'Success',
        data: nameSubCategories,
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        message: 'Sub Categories not found',
      });
    }
  }
}

export default SubCategoriesController;
