// import { promisify } from 'util';
import crypto from 'crypto';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { Email } from '../utils/email.js';
//for creating the token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90 days',
  });
};

let cookieOption = {
  expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: req.secure || req.headers['x-forwarded-proto' === 'https'],
};

//for creating token and sending response with cookie
const createTokenAndSend = (id, user, res, req) => {
  const token = createToken(id);
  res.cookie('jwt', token, cookieOption);
  user.password = undefined;

  res.status(201).json({
    message: 'success',
    token,
    data: {
      user,
    },
  });
};
//handler for signing up the user
export const signup = async (req, res) => {
  try {
    const userDocument = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    };
    const newUser = await userModel.create(userDocument);
    //sending the welcome email for the newly login user.
    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendWelcome();
    createTokenAndSend(newUser._id, newUser, res);
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};
//handler for logging in the user
export const signin = async (req, res) => {
  try {
    //1 check if the email and password is available
    const { email, password } = req.body;

    if (!email || !password) {
      throw Error('the email or password is missing..');
    }

    //2 check if the user exist with that email
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
      throw Error('email or password is wrong ');
    }
    //3 check if the password provided by the user is same as the password that is in the database
    const isPasswordCorrect = await user.checkPassword(password, user.password);
    //4 if there is no error in the process, then create the token and send response to the client.
    if (!isPasswordCorrect) {
      throw Error('email or password is wrong ');
    }
    createTokenAndSend(user._id, user, res);
  } catch (error) {
    res.status(401).json({ status: 'fail', message: error.message });
  }
};
//signup handler
export const signout = (req, res, next) => {
  res.cookie('jwt', 'logded Out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};
//middleware for checking the user is logged in or not before executing some important route
export const protect = async (req, res, next) => {
  let token;
  try {
    //1 check if the token exist in the req.headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      throw Error('you are not authenticated');
    }
    // //2 token verification

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    //3 See if the user with that id still exists
    const user = await userModel.findById(decoded.id);

    if (!user) {
      throw Error('the user with such token does not exist.');
    }
    //4 see if the password is change after the token was issued.
    if (user.passwordChanged(decoded.iat)) {
      throw Error('the password has been changed, please log in again.');
    }

    req.user = user;
    res.locals.user = user;
    next();
  } catch (error) {
    res.status(401).json({ status: 'fail', message: error.message });
  }
};
//middleware for checking the user is logged in or not before executing some important route. This is quite similar to protect handler but we dont throw error here.
export const isLoggedIn = async (req, res, next) => {
  //1 check if the cookies is there.
  if (req.cookies.jwt) {
    try {
      // //2 token verification

      const decoded = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

      //3 See if the user with that id still exists
      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next();
      }
      //4 see if the password is change after the token was issued.
      if (user.passwordChanged(decoded.iat)) {
        return next();
      }
      //this will set the user variable in the pug templete so we can use this.
      res.locals.user = user;
      return next();
    } catch (error) {
      return next();
    }
  }
  next();
};

//giving permission to admin only to play with the database
export const restrictTo = (...role) => {
  return (req, res, next) => {
    try {
      if (!role.includes(req.user.role)) {
        throw Error('the permission is not given to the user');
      }
      next();
    } catch (error) {
      res.status(403).json({ status: 'fail', message: error.message });
    }
  };
};
//handler for resetting the password.1)first step so that we can send reset token to the email.
export const forgetpassword = async (req, res, next) => {
  try {
    //get the email id with the user
    const email = req.body.email;
    //then, query for that user with given email id
    const user = await userModel.findOne({ email });
    //then,if there is user then generate the reset token and send back to the user.
    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    //sent it to user email to reset the password
    try {
      const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/users/resetpassword/${resetToken}`;
      await new Email(user, resetURL).sendResetToken();
      res
        .status(200)
        .json({ status: 'success', message: 'token sent to the email.' });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500).json({
        message: 'failed',
        error: error.message,
      });
    }
  } catch (error) {
    res.status(404).json({
      message: 'failed',
      error: error.message,
    });
  }
};
//handler for reseting the password with reset token and token expires send in the email.
export const resetpassword = async (req, res, next) => {
  try {
    //get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      throw Error('the token is invalid or expired.');
    }
    //if token is not expired and there is user, set the new password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    //update changePasswordAt property fot the user
    //log the user in and send JWT
    createTokenAndSend(user._id, user, res);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
//handler for updating the password
export const updatePassword = async (req, res, next) => {
  try {
    //get the user id
    const currentPassword = req.body.passwordCurrent;

    const user = await userModel
      .findOne({ email: req.user.email })
      .select('+password');

    //3 check if the password provided by the user is same as the password that is in the database
    const isPasswordCorrect = await user.checkPassword(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      throw Error(
        'the password provided is not correct, please the password and type again.'
      );
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    createTokenAndSend(user._id, user, res, req);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
