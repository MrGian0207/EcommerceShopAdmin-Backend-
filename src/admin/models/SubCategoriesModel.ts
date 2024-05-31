import mongoose, { Schema } from 'mongoose';
import { SubCategories } from '../../types/SubCategoriesType';

const SubCategoriesSchema = new Schema<SubCategories>(
   {
      name: { type: String, required: true },
      title: { type: String, required: true },
      slug: { type: String, required: true },
      description: { type: String, required: true },
      parentCategory: { type: String, required: true },
      image: { type: String, required: true },
   },
   {
      timestamps: true,
   },
);

const SubCategoriesModel = mongoose.model<SubCategories>(
   'SubCategories',
   SubCategoriesSchema,
);

export default SubCategoriesModel;
