import { Request, Response } from 'express';
import cloudinary from '../../../utils/cloudinary';
import SubCategoriesModel from '../../models/SubCategoriesModel';

class SubCategoriesController {
    async store(req: Request, res: Response) {
        try {
            const { name, title, slug, description, parentCategories } =
                req.body;
            const image = req.file;

            // Kiểm tra các trường bắt buộc
            if (
                !name ||
                !title ||
                !slug ||
                !description ||
                !parentCategories ||
                !image
            ) {
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
                parentCategory: parentCategories.trim(),
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
}

export default SubCategoriesController;
