import express from 'express';
import { logout } from '../public/js/login.js';
import { isLoggedIn, protect } from '../routeHandlers/authHandler.js';
import {
  loginHandler,
  overviewHandler,
  tourHandler,
  accountHandler,
} from '../routeHandlers/viewHandler.js';

const viewRouter = express.Router();

viewRouter.get('/', isLoggedIn, overviewHandler);
viewRouter.get('/tour/:slug', isLoggedIn, tourHandler);
viewRouter.get('/login', isLoggedIn, loginHandler);
viewRouter.get('/logout', logout);
viewRouter.get('/me', protect, accountHandler);

export default viewRouter;
