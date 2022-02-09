//importing modules
import multer from 'multer';
import sharp from 'sharp';
import tourModel from '../models/tourModel.js';
import {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAll,
} from './handlerFactory.js';

// middlerware handler for getting top five tours
export const setQueryParameters = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,duration,difficulty,summary,ratingAverage,price';
  next();
};
//middleware for checking the body consists of the name and price before posting the tour.
export const checkmiddlePost = (req, res, next) => {
  const reqTourName = req.body.name;
  const reqTourPrice = req.body.price;

  if (!(reqTourName && reqTourPrice)) {
    return res.status(404).json({
      status: 'fail',
      message: 'no data to add.',
    });
  }
  next();
};
//multer configuration for uploading multiple images
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
//middleware for uploading the multiple photos
export const uploadTourPhotos = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);
//middleware for resizing the photo
export const resizeUploadPhotos = async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-imagecover.jpeg`;
  //1) saving the cover image
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);
  //2) saving the images
  //here we are using the promise.all because if we dont await the sharp process, the data will not be saved in the database and the next function will be callled in tha middleware stack..
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);
      req.body.images.push(filename);
    })
  );

  next();
};
export const getAllTours = getAll(tourModel);
export const getTour = getOne(tourModel, { path: 'reviews' });
export const postNewTour = createOne(tourModel);
export const updateTour = updateOne(tourModel);
export const deleteTour = deleteOne(tourModel);
//middleware for checking the data is there or not before posting the data to database

export const aggregationTour = async (req, res) => {
  try {
    const tourAggretion = await tourModel.aggregate([
      //match is kind of filtering data.
      { $match: { ratingAverage: { $gte: 4 } } },
      {
        //group is like doing all the calculation with _id with is required.
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          avgRating: { $avg: '$ratingAverage' },
          minPrice: { $min: '$price' },
          avgPrice: { $avg: '$price' },
        },
      },
      { $sort: { minPrice: 1 } },
    ]);
    res.status(200).json({
      message: 'success',
      data: {
        tourAggretion,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};
//handler for getting geospatial tours
export const getToursWithin = async (req, res, next) => {
  try {
    const { distance, latlong, unit } = req.params;
    const [latitude, longitude] = latlong.split(',');
    const radius = unit === 'mile' ? distance / 3963.2 : distance / 6378.1;
    const tours = await tourModel.find({
      startLocation: {
        $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
      },
    });
    res
      .status(200)
      .json({ message: 'success', tours: tours.length, date: tours });
  } catch (error) {
    res.status(404).json({ message: 'fail' });
  }
};
//creating the handler for aggretation of tour with distance and name
export const getAggregateTour = async (req, res, next) => {
  try {
    const { distance, unit } = req.params;

    const [latitude, longitude] = distance.split(',');
    console.log(latitude, longitude);
    const distances = await tourModel.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [longitude * 1, latitude * 1] },
          distanceField: 'distance',
        },
      },
    ]);
    res.status(200).json({
      message: 'success',
      data: distances,
    });
  } catch (error) {
    res.status(404).json({
      message: 'fail',
      err: error.message,
    });
  }
};
