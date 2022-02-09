import reviewModel from '../models/reviewModel.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory.js';

export const savetournuser = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
//All the handler function
export const getAllReviews = getAll(reviewModel);
export const getReview = getOne(reviewModel);
export const postReview = createOne(reviewModel);
export const updateReview = updateOne(reviewModel);
export const deleteReview = deleteOne(reviewModel);
