import { Schema } from 'mongoose';

export interface UserRefreshToken {
   userId: Schema.Types.ObjectId;
   refreshToken: string;
   createdAt?: Date;
}
