import userModel from '../models/userModel.js';
import multer from 'multer';
import sharp from 'sharp';
import { deleteOne, getAll, getOne, updateOne } from './handlerFactory.js';
//middleware to change the req.body.params filed

export const getMeMiddleware = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
//creating a multer middleware for uploading the file.
//this can be done if you want to save the photo in the dist before resizing the photo
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/img/users');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });
//creating the memory storage which will store data in memory.
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image, please upload the image!'));
  }
};
const upload = multer({ storage, fileFilter });
//middleware for uploading the single photo
export const uploadSinglePhoto = upload.single('photo');
// sharp middleware for resizing the image.
export const resizeUploadPhoto = async (req, res, next) => {
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};

const filteredObj = (reqObj, ...allowedFields) => {
  //new object can have email, name prop to change
  const newObj = {};
  Object.keys(reqObj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = reqObj[el];
  });
  return newObj;
};
export const updataMe = async (req, res, next) => {
  try {
    //check if the user sends only the limited fileds for change.
    if (req.body.password || req.body.passwordConfirm) {
      throw Error('please use the other route for changing the password.');
    }

    let filteredBody = filteredObj(req.body, 'name', 'email');
    console.log(req.file.filename);
    if (req.file) {
      filteredBody.photo = req.file.filename;
    }

    //must logged in before doing changing it

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        runValidators: true,
        new: true,
      }
    );

    //send the response after changing the requested properties
    res.status(200).json({
      message: 'success',
      data: updatedUser,
    });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error.message });
  }
};
export const deleteMe = async (req, res, next) => {
  try {
    await userModel.findByIdAndUpdate(req.user.id, {
      active: false,
    });
    res.status(204).json({
      status: 'success',
      message: 'deleted',
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

export const getAllUser = getAll(userModel);
export const updateUser = updateOne(userModel);
export const getUser = getOne(userModel);
export const deleteUser = deleteOne(userModel);
