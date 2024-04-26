import mongoose, { Schema } from 'mongoose';

interface User {
  fullName?: string;
  gender?: string;
  phoneNumber?: number;
  emailAddress?: string;
  password?: string;
  status?: string;
  role?: string;
  about?: string;
  image?: string;
}

const UserSchema = new Schema<User>(
  {
    fullName: { type: String, required: true },
    gender: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    emailAddress: { type: String, required: true },
    password: { type: String, required: true },
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
