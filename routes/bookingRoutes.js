import express from 'express';
import { protect } from '../routeHandlers/authHandler.js';
import { getCheckoutSessionHandler } from '../routeHandlers/bookingHandler.js';

const bookingRouter = express.Router();
//booking route
bookingRouter.get(
  '/checkout-session/:tourId',
  protect,
  getCheckoutSessionHandler
);
export default bookingRouter;
