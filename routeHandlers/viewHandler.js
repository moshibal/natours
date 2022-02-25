import tourModel from '../models/tourModel.js';
import userModel from '../models/userModel.js';
export const overviewHandler = async (req, res) => {
  const tours = await tourModel.find();
  res.render('_overview', { title: 'overview', tours });
};
export const tourHandler = async (req, res) => {
  try {
    const tour = await tourModel
      .findOne({ slug: req.params.slug })
      .populate({ path: 'reviews' });

    res.render('_tour', { title: tour.name, tour });
  } catch (error) {
    res.render('_error', { error: 'please try it again.' });
  }
};

export const loginHandler = async (req, res) => {
  try {
    res.status(200).render('_login', {
      title: 'Log into your account',
    });
  } catch (error) {
    res.render('_error', { error: 'please try it again.' });
  }
};
export const signUpHandler = async (req, res) => {
  try {
    res.status(200).render('_signup', {
      title: 'sign up into your account',
    });
  } catch (error) {
    res.render('_error', { error: 'please try it again.' });
  }
};

export const logoutHandler = async (req, res) => {
  try {
    res.status(200).render('_overview', {
      title: 'overview',
    });
  } catch (error) {
    res.render('_error', { error: 'please try it again.' });
  }
};
export const accountHandler = async (req, res) => {
  try {
    res.status(200).render('_account', {
      title: 'account page',
    });
  } catch (error) {
    res.render('_error', { error: 'please try it again.' });
  }
};
