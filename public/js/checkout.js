import axios from 'axios';
import { showAlert } from './alert.js';
const stripe = Stripe(
  'pk_test_51KQpuTKrlXNuJzMcYQn015K2UlTnesCu0KnHXGEwbG52vHrjHOgKV5HlKzukUhRwPbaK846qTRlnkj5igvxt84Kd00RMfao0h2'
);

export const bookNow = async (tourID) => {
  try {
    //1)get checkout session from the api
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourID}`
    );
    console.log(session);
    //2)create checkout form and charge the credit card
    if (session) {
      await stripe.redirectToCheckout({ sessionId: session.data.session.id });
    }
  } catch (error) {
    showAlert('error', error);
  }
};
