import express from 'express';
import { protect, restrictTo } from '../routeHandlers/authHandler.js';
import {
  deleteReview,
  getAllReviews,
  getReview,
  postReview,
  savetournuser,
  updateReview,
} from '../routeHandlers/reviewHandler.js';
const reviewRouter = express.Router({ mergeParams: true });
//for authenticated user only
reviewRouter.use(protect);
reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), savetournuser, postReview);
reviewRouter
  .route('/:id')
  .get(getReview)
  .delete(restrictTo('admin', 'user'), deleteReview)
  .patch(restrictTo('admin', 'user'), updateReview);

export default reviewRouter;
