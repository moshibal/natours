import tourModel from '../models/tourModel.js';
import Stripe from 'stripe';

export const getCheckoutSessionHandler = async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await tourModel.findById(req.params.tourId);

  // 2) Create Checkout session
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: `${tour.name} Tour` },
          unit_amount: `${tour.price * 100}`,
        },
        quantity: 1,

        description: tour.summary,
      },
    ],

    success_url: 'http://localhost:3000/',
    cancel_url: 'http://localhost:3000/',
  });

  // 3) Create Session as response
  res.status(200).json({
    status: 'success',
    session,
  });
};
