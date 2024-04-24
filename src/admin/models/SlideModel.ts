import mongoose, { Schema } from 'mongoose';

interface Slide {
  heading?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  description?: string;
  displaySlide?: string;
  image?: string;
}

const SlideSchema = new Schema<Slide>(
  {
    heading: { type: String, required: true },
    primaryButtonText: { type: String, required: true },
    primaryButtonLink: { type: String },
    secondaryButtonText: { type: String, required: true },
    secondaryButtonLink: { type: String },
    description: { type: String, required: true },
    displaySlide: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const SlideModel = mongoose.model<Slide>('Slide', SlideSchema);

export default SlideModel;
