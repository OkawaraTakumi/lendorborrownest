import * as mongoose from 'mongoose';
const FollowSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please add a name'],
    unique: true,
  },
  email: {
    type: String,
    requied: [true, 'please add a email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a paaword'],
    minlength: 6,
    select: false,
    unique: true,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  follow: {
    type: [FollowSchema],
    default: [],
    unique: true,
  },
});
