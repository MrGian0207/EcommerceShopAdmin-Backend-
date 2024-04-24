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
      console.log(req.body);
      console.log(image);

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
}

export default SlideController;
