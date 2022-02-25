import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
//this code is for dirname as esmodule system doesnot support this.
import path from 'path';
export const __dirname = path.resolve();

import express from 'express';

import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';

//import the routers..
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import viewRouter from './routes/viewRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

//creating the app using express,
const app = express();
app.use(cors());

app.enable('trust proxy');
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);
//for serving static files
app.use(express.static(`${__dirname}/public`));

//Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!

const scriptSrcUrls = [
  'https://unpkg.com/axios/dist/axios.min.js',
  'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://*.cloudflare.com',
  'https://js.stripe.com/v3/',
  'ws://localhost:1234/',
];
const styleSrcUrls = [
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
];
const connectSrcUrls = [
  'https://unpkg.com/axios/dist/axios.min.js',
  'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/',
  'https://*.cloudflare.com',
  'ws://localhost:1234/',

  'http://127.0.0.1:1337/',
  'https://js.stripe.com/v3/',
];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],

      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:'],
      fontSrc: ["'self'", ...fontSrcUrls],
      frameSrc: ['https://js.stripe.com/v3/'],
    },
  })
);

//using the middleware to get the data from the req object send by the client.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//middleware for limiting the max number of request
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message:
    'the max limit has exceeded for this ip address.please try after 15 mins.',
});

// Apply the rate limiting middleware to API calls only
app.use('/api', apiLimiter);
//body-parser middleware for getting the req.body property.
app.use(express.json());
app.use(cookieParser());
//sanitization
// By default, $ and . characters are removed completely from user-supplied input in the following places:
// - req.body
// - req.params
// - req.headers
// - req.query

// To remove data using these defaults:
app.use(mongoSanitize());
//another middleware to sanizite user input comming from POST body,GET queries.
app.use(xss());
//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
    ],
  })
);

//creating own middleware to add createdAt property
app.use((req, res, next) => {
  req.createdAt = new Date().toISOString();

  next();
});
import { getcart, postcart } from './routeHandlers/carthandler.js';
//Routes
app.get('/getcart', getcart);
app.post('/postcart', postcart);
//main
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
//listening the app on the port 3000..
export default app;
