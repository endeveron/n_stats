import { Schema, model, models } from 'mongoose';
import { User, UserRole } from '@/core/features/auth/types';

const statisticsItemSchema = new Schema(
  {
    appId: { type: String },
    data: { type: String },
    timestamp: { type: Number },
  },
  { _id: false }
);

const userSchema = new Schema<User>(
  {
    id: { type: String },
    name: { type: String },
    email: { type: String, required: true },
    emailConfirmed: { type: Boolean, default: false },
    password: { type: String },
    role: { type: String, enum: UserRole, default: UserRole.user },
    image: { type: String },
    statistics: [statisticsItemSchema],
  },
  {
    versionKey: false,
  }
);

const UserModel = models.User || model('User', userSchema);

export default UserModel;
