import mongoose, { Schema } from 'mongoose'

import { UserRefreshToken } from '../../types/TokenType'

const UserRefreshTokenSchema = new Schema<UserRefreshToken>({
  userId: { type: Schema.Types.ObjectId, required: true },
  refreshToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 30 * 86400 }, // 30 days
})

const UserRefreshTokenModel = mongoose.model('UserRefreshToken', UserRefreshTokenSchema)

export default UserRefreshTokenModel
