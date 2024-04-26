import { Request, Response } from 'express';
import cloudinary from '../../../utils/cloudinary';
import SlideModel from '../../models/SlideModel';
import { UploadApiResponse } from 'cloudinary';

class SlideController {
  async store(req: Request, res: Response) {
    try {
      const {
        heading,
        primaryButtonText,
        primaryButtonLink,
        secondaryButtonText,
        secondaryButtonLink,
        description,
        displaySlide,
      } = req.body;
      const image = req.file;

      const requiredFields = [
        heading,
        primaryButtonText,
        secondaryButtonText,
        description,
        displaySlide,
        image,
      ];

      if (requiredFields.some((field) => !field)) {
        return res.status(400).json({
          status: 'Error',
          message: 'Missing required fields',
        });
      }

      // Tải hình ảnh lên Cloudinary
      let imageUrl: UploadApiResponse;
      if (image) {
        imageUrl = await cloudinary.uploader.upload(image.path, {
          folder: 'slides',
        });

        // Kiểm tra nếu hình ảnh không tải lên thành công
        if (!imageUrl || !imageUrl.secure_url) {
          return res.status(400).json({
            status: 'Error',
            message: 'Failed to upload image',
          });
        }

        const slide = new SlideModel({
          heading,
          primaryButtonText,
          primaryButtonLink,
          secondaryButtonText,
          secondaryButtonLink,
          description,
          displaySlide,
          image: imageUrl.secure_url,
        });

        await slide.save();
        return res.status(200).json({
          status: 'Success',
          message: 'Slide have been saved successfully',
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const slides = await SlideModel.find();
      return res.status(200).json({
        status: 'Success',
        data: slides,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const slide = await SlideModel.findById(id);
      if (slide) {
        return res.status(200).json({
          status: 'Success',
          data: slide,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        heading,
        primaryButtonText,
        primaryButtonLink,
        secondaryButtonText,
        secondaryButtonLink,
        description,
        displaySlide,
      } = req.body;
      const image = req.file;
      const slide = await SlideModel.findById(id);

      // Tải hình ảnh lên Cloudinary
      let imageUrl: UploadApiResponse;
      if (image) {
        const deletedImage: string = slide?.image as string;
        const publicIdRegex = /\/slides\/([^/.]+)/;
        const matches = deletedImage.match(publicIdRegex);

        await cloudinary.uploader.destroy(
          `slides/${matches && matches[1]}`,
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
          folder: 'slides',
        });

        // Kiểm tra nếu hình ảnh không tải lên thành công
        if (!imageUrl || !imageUrl.secure_url) {
          return res.status(400).json({
            status: 'Error',
            message: 'Failed to upload image',
          });
        }

        if (slide) {
          slide.heading = heading;
          slide.primaryButtonText = primaryButtonText;
          slide.primaryButtonLink = primaryButtonLink;
          slide.secondaryButtonText = secondaryButtonText;
          slide.secondaryButtonLink = secondaryButtonLink;
          slide.description = description;
          slide.displaySlide = displaySlide;
          slide.image = imageUrl.secure_url;
          await slide.save();
          return res.status(200).json({
            status: 'Success',
            message: 'Slide have been updated successfully',
          });
        }
      } else {
        if (slide) {
          slide.heading = heading;
          slide.primaryButtonText = primaryButtonText;
          slide.primaryButtonLink = primaryButtonLink;
          slide.secondaryButtonText = secondaryButtonText;
          slide.secondaryButtonLink = secondaryButtonLink;
          slide.description = description;
          slide.displaySlide = displaySlide;
          await slide.save();
          return res.status(200).json({
            status: 'Success',
            message: 'Slide have been updated successfully',
          });
        }
      }
    } catch (error) {
      console.log(error);
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
      const slide = await SlideModel.findById(id);
      if (slide) {
        const deletedImage: string = slide?.image as string;
        const publicIdRegex = /\/slides\/([^/.]+)/;
        const matches = deletedImage.match(publicIdRegex);

        await cloudinary.uploader.destroy(
          `slides/${matches && matches[1]}`,
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

        await slide?.deleteOne();
        const confirmDelete = await SlideModel.findById(id);
        if (confirmDelete) {
          return res.status(404).json({
            status: 'Error',
            message: 'Slide not found',
          });
        } else {
          return res.status(200).json({
            status: 'Success',
            message: 'Slide have been deleted successfully !!!',
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

export default SlideController;
