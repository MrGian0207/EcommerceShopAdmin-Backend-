import mongoose, { Schema } from 'mongoose';

interface Newletter {
  email?: string;
}

const NewletterSchema = new Schema(
  {
    emailNewletter: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const NewletterModel = mongoose.model<Newletter>('Newletter', NewletterSchema);

export default NewletterModel;
