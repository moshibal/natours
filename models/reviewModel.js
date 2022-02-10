import mongoose from 'mongoose';
import tourModel from './tourModel.js';

const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, 'Review cannot be empty'] },
    rating: { type: Number, min: 1, max: 5 },
    createAt: { type: Date, default: Date.now },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
//pre hooks
//for populating the review with user data and also the tour data
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
  });

  next();
});
//creating the static function for calculating the avarage Rating.
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  //this key means model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await tourModel.findByIdAndUpdate(tourId, {
    ratingAverage: stats[0].avgRating,
    ratingQuantity: stats[0].nRating,
  });
};
//this is for having one user to review one time on any tour.

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
//this post hook is used to calculate average while creating new review.
reviewSchema.post('save', function () {
  //this represents current doc.
  this.constructor.calcAverageRatings(this.tour);
});
//this pre and post hook are used while updating and deleting the existing review.
reviewSchema.pre(/^findOneAnd/, async function (next) {
  //this is query
  //this took me 2 days to debug.
  //the problem here is very simple that you cant do same query twice, you use of clone method on query to re execute again.
  //this is second query which is problem in mongoose v.6
  const r = this.findOne({});
  this.review = await r.clone();

  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  await this.review.constructor.calcAverageRatings(this.review.tour);
});
const reviewModel = mongoose.model('Review', reviewSchema);
export default reviewModel;
