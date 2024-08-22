import mongoose, { Schema } from 'mongoose'

import { User } from '../../types/UserType'

const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    gender: { type: String },
    phone: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    statusUser: { type: String, required: true },
    role: { type: String },
    about: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
)

const UserModel = mongoose.model<User>('User', UserSchema)

export default UserModel
