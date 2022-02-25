import express from 'express';
import { logout } from '../public/js/login.js';
import { isLoggedIn, protect, signup } from '../routeHandlers/authHandler.js';
import {
  loginHandler,
  overviewHandler,
  tourHandler,
  accountHandler,
  signUpHandler,
} from '../routeHandlers/viewHandler.js';

const viewRouter = express.Router();

viewRouter.get('/', isLoggedIn, overviewHandler);
viewRouter.get('/tour/:slug', isLoggedIn, tourHandler);
viewRouter.get('/login', isLoggedIn, loginHandler);
viewRouter.get('/signup', signUpHandler);
viewRouter.get('/logout', logout);
viewRouter.get('/me', protect, accountHandler);

export default viewRouter;
