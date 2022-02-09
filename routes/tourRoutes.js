import express from 'express';
import {
  getAllTours,
  postNewTour,
  getTour,
  deleteTour,
  updateTour,
  setQueryParameters,
  aggregationTour,
  checkmiddlePost,
  getToursWithin,
  getAggregateTour,
  uploadTourPhotos,
  resizeUploadPhotos,
} from '../routeHandlers/tourHandler.js';
import reviewRouter from './reviewRoutes.js';
import { protect, restrictTo } from '../routeHandlers/authHandler.js';
//routes
const tourRouter = express.Router();
//creating route for the geospatial location
tourRouter
  .route('/tours-within/:distance/center/:latlong/unit/:unit')
  .get(getToursWithin);
//creating the route for the aggregation pipeline
tourRouter.route('/:distance/unit/:unit').get(getAggregateTour);
//for all user
tourRouter.use('/:tourId/reviews', reviewRouter);
//creating the route for the top five cheap tour
tourRouter.route('/top-5-cheap-tour').get(setQueryParameters, getAllTours);
//creating the route for the aggregation pipeline
tourRouter.route('/get-averagerating').get(aggregationTour);
// tourRouter.param('id', checkId);
tourRouter.route('/').get(getAllTours);
tourRouter.route('/:id').get(getTour);
//for authenticated user
tourRouter
  .route('/')
  .post(
    checkmiddlePost,
    protect,
    restrictTo('admin', 'lead-guide', 'guide'),
    postNewTour
  );

tourRouter
  .route('/:id')
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourPhotos,
    resizeUploadPhotos,
    updateTour
  );
export default tourRouter;
