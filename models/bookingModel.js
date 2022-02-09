import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must have a tour.'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must have a user.'],
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price.'],
  },
  paid: {
    type: Boolean,
    default: true,
  },
});
//pre hooks
//for populating the booking with user data and also the tour data
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
  }).populate({
    path: 'tour',
    select: 'name',
  });

  next();
});

const bookingModel = mongoose.model('Booking', bookingSchema);
export default bookingModel;
