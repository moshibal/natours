import express from 'express';
import {
  deleteMe,
  updataMe,
  getAllUser,
  updateUser,
  getMeMiddleware,
  getUser,
  deleteUser,
  uploadSinglePhoto,
  resizeUploadPhoto,
} from '../routeHandlers/userHandler.js';
import {
  protect,
  signup,
  signin,
  resetpassword,
  forgetpassword,
  updatePassword,
  restrictTo,
  signout,
} from '../routeHandlers/authHandler.js';
import { getOne } from '../routeHandlers/handlerFactory.js';

const userRouter = express.Router();
//for all user
userRouter.post('/signup', signup);
userRouter.post('/signin', signin);
userRouter.get('/logout', signout);
userRouter.patch('/resetpassword/:token', resetpassword);
userRouter.post('/forgetpassword', forgetpassword);

//for authenticated user
userRouter.get('/me', protect, getMeMiddleware, getOne);
userRouter.patch('/updatepassword', protect, updatePassword);
userRouter.patch(
  '/updateme',
  protect,
  uploadSinglePhoto,
  resizeUploadPhoto,
  updataMe
);
userRouter.delete('/deleteme', protect, deleteMe);

//for administrator only
userRouter.use(protect);
userRouter.use(restrictTo('admin'));
userRouter.get('/', getAllUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
