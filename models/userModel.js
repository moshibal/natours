import mongoose from 'mongoose';
import crypto from 'crypto';

import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please tell us your name'],
    },
    email: {
      type: String,
      required: [true, 'please give us your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'please provide a valid email'],
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'lead-guide', 'guide'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'please provide a password'],
      minlength: 8,
      select: false,
    },
    passwordChangeAt: { type: Date, default: Date.now },
    passwordConfirm: {
      type: String,
      required: [true, 'please confirm your password'],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'the password doesnot match',
      },
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
//All are the pre save hook that runs before saving the document
userSchema.pre('save', async function (next) {
  // run this function is the password is modified.
  if (!this.isModified('password')) return next();
  //hashing the password
  this.password = await bcrypt.hash(this.password, 12);
  //taking out the passwordcomfirm property as you don't need this in the database.
  this.passwordConfirm = undefined;

  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangeAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
//All are instance methods that are available on the instance object
userSchema.methods.checkPassword = async function (
  clientPassword,
  dataPassword
) {
  return await bcrypt.compare(clientPassword, dataPassword);
};
userSchema.methods.passwordChanged = function (tokenIssuedAt) {
  if (this.passwordChangeAt) {
    const passwordchangedTime = parseInt(
      this.passwordChangeAt.getTime() / 1000
    );

    return tokenIssuedAt < passwordchangedTime;
  }
  //false meas not change
  return false;
};
userSchema.methods.createResetPasswordToken = function () {
  //generate the reset token and save to the database as hash

  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
const userModel = mongoose.model('User', userSchema);
export default userModel;
