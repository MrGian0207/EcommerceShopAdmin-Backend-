import mongoose, { Schema } from 'mongoose';
import { Newletter } from '../../types/NewLetter';

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
