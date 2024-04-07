import mongoose, { Schema } from 'mongoose';

interface MainCategories {
    name?: string;
    title?: string;
    slug?: string;
    description?: string;
    image?: string;
}

const MainCategoriesSchema = new Schema<MainCategories>(
    {
        name: { type: String, required: true },
        title: { type: String, required: true },
        slug: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

const MainCategoriesModel = mongoose.model<MainCategories>(
    'MainCategories',
    MainCategoriesSchema,
);

export default MainCategoriesModel;
