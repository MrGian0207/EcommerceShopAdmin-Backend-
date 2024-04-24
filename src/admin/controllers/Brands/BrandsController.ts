import { Request, Response } from 'express';
import cloudinary from '../../../utils/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import BrandsModel from '../../models/BrandsModel';

class BrandsController {
  async store(req: Request, res: Response) {
    try {
      const { name, title, slug, description } = req.body;
      const image = req.file;

      // Kiểm tra các trường bắt buộc
      if (!name || !title || !slug || !description || !image) {
        return res.status(400).json({
          status: 'Error',
          message: 'Missing required fields',
        });
      }

      // Tải lên hình ảnh lên Cloudinary
      const imageUrl = await cloudinary.uploader.upload(image.path, {
        folder: 'brands',
      });

      // Kiểm tra nếu hình ảnh không tải lên thành công
      if (!imageUrl || !imageUrl.secure_url) {
        return res.status(400).json({
          status: 'Error',
          message: 'Failed to upload image',
        });
      }

      // Tạo đối tượng BrandsModel
      const brands = new BrandsModel({
        name: name.trim(),
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        image: imageUrl.secure_url,
      });

      // Lưu đối tượng vào cơ sở dữ liệu
      await brands.save();

      // Trả về kết quả thành công
      return res.status(200).json({
        status: 'Success',
        message: 'Brands have been saved successfully !!!',
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
    const brands = await BrandsModel.find();
    if (brands) {
      return res.status(200).json({
        status: 'Success',
        data: brands,
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        message: 'Brands not found',
      });
    }
  }

  async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const brands = await BrandsModel.findById(id);
    if (brands) {
      return res.status(200).json({
        status: 'Success',
        data: brands,
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        message: 'Brands not found',
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, title, slug, description } = req.body;
      const image = req.file;
      let imageUrl: UploadApiResponse;

      if (!name || !title || !slug || !description) {
        return res.status(400).json({
          status: 'Error',
          message: 'Missing required fields',
        });
      }

      const brands = await BrandsModel.findById(id);

      if (image) {
        const deletedImage: string = brands?.image as string;
        const publicIdRegex = /\/brands\/([^/.]+)/;
        const matches = deletedImage.match(publicIdRegex);

        await cloudinary.uploader.destroy(
          `brands/${matches && matches[1]}`,
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
          folder: 'brands',
        });

        if (brands) {
          (brands.name = name.trim()),
            (brands.title = title.trim()),
            (brands.slug = slug.trim()),
            (brands.description = description.trim()),
            (brands.image = imageUrl ? imageUrl.secure_url : '');

          brands?.save();

          // Trả về kết quả thành công
          return res.status(200).json({
            status: 'Success',
            message: 'Brands have been updated successfully !!!',
          });
        }
      } else {
        if (brands) {
          (brands.name = name.trim()),
            (brands.title = title.trim()),
            (brands.slug = slug.trim()),
            (brands.description = description.trim()),
            brands?.save();

          // Trả về kết quả thành công
          return res.status(200).json({
            status: 'Success',
            message: 'Brands have been updated successfully !!!',
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
      const brands = await BrandsModel.findById(id);
      if (brands) {
        const deletedImage: string = brands?.image as string;
        const publicIdRegex = /\/brands\/([^/.]+)/;
        const matches = deletedImage.match(publicIdRegex);

        await cloudinary.uploader.destroy(
          `brands/${matches && matches[1]}`,
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

        await brands?.deleteOne();
        const confirmDelete = await BrandsModel.findById(id);
        if (confirmDelete) {
          return res.status(404).json({
            status: 'Error',
            message: 'Brands not found',
          });
        } else {
          return res.status(200).json({
            status: 'Success',
            message: 'Brands have been deleted successfully !!!',
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

  async brands(req: Request, res: Response) {
    const nameBrands = await BrandsModel.distinct('name');
    if (nameBrands) {
      return res.status(200).json({
        status: 'Success',
        data: nameBrands,
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        message: 'Brands not found',
      });
    }
  }
}
export default BrandsController;
