import mongoose, { Schema } from 'mongoose'

import { MainCategories } from '../../types/MainCategoriesType'

const MainCategoriesSchema = new Schema<MainCategories>(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    totalProducts: { type: Number },
  },
  {
    timestamps: true,
  }
)

const MainCategoriesModel = mongoose.model<MainCategories>('MainCategories', MainCategoriesSchema)

export default MainCategoriesModel
