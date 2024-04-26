import { Request, Response } from 'express';
import UserModel from '../../models/UserModel';
import cloudinary from '../../../utils/cloudinary';

class UsersController {
  async getAll(req: Request, res: Response) {
    try {
      const users = await UserModel.find();
      return res.status(200).json({
        status: 'Success',
        data: users,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        status: 'Error',
        message: 'Users have not been found',
      });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const user = await UserModel.findOne({ _id: id });
      if (user) {
        res.status(200).json({
          status: 'Success',
          data: user,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({
        status: 'Error',
        message: 'User have not been found',
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id, name, emailAddress, phone, gender, about } = req.body;
      const image = req.file;

      const user = await UserModel.findById(id);
      if (image && !user?.image) {
        const imageUrl = await cloudinary.uploader.upload(image.path, {
          folder: 'users',
        });
        // Kiểm tra nếu hình ảnh không tải lên thành công
        if (!imageUrl || !imageUrl.secure_url) {
          return res.status(400).json({
            status: 'Error',
            message: 'Failed to upload image',
          });
        }

        if (user) {
          user.image = imageUrl?.secure_url;
        }
        user?.save();
      } else if (image && user?.image !== undefined) {
        const deletedImage: string = user?.image as string;
        const publicIdRegex = /\/users\/([^/.]+)/;
        const matches = deletedImage.match(publicIdRegex);

        await cloudinary.uploader.destroy(
          `users/${matches && matches[1]}`,
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

        const imageUrl = await cloudinary.uploader.upload(image.path, {
          folder: 'users',
        });
        if (!imageUrl || !imageUrl.secure_url) {
          return res.status(400).json({
            status: 'Error',
            message: 'Failed to upload image',
          });
        }

        if (user) {
          user.fullName = name;
          user.emailAddress = emailAddress;
          user.phoneNumber = phone;
          user.gender = gender;
          user.about = about;
          user.image = imageUrl?.secure_url;
        }

        user?.save();
      } else {
        if (user) {
          user.fullName = name;
          user.emailAddress = emailAddress;
          user.phoneNumber = phone;
          user.gender = gender;
          user.about = about;
        }
        user?.save();
      }

      return res.status(200).json({
        status: 'Success',
        message: 'User have been updated successfully !!!',
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        status: 'Error',
        message: 'User have not been updated',
      });
    }
  }
}

export default UsersController;
