import mongoose, { Schema } from 'mongoose';
import { User } from '../../types/UserType';

const UserSchema = new Schema<User>(
   {
      fullName: { type: String, required: true },
      gender: { type: String },
      phoneNumber: { type: Number },
      emailAddress: { type: String, required: true },
      password: { type: String },
      status: { type: String, required: true },
      role: { type: String },
      about: { type: String },
      image: { type: String },
   },
   {
      timestamps: true,
   },
);

const UserModel = mongoose.model<User>('User', UserSchema);

export default UserModel;
