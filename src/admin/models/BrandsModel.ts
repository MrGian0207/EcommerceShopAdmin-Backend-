import mongoose, { Schema } from 'mongoose';
import { Brands } from '../../types/BrandType';

const BrandSchema = new Schema<Brands>(
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

const BrandModel = mongoose.model<Brands>('Brands', BrandSchema);

export default BrandModel;
