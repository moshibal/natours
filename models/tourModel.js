import mongoose from 'mongoose';
import slugify from 'mongoose-slug-generator';

// import reviewModel from './reviewModel.js';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'the name field is required..'],
      unique: true,
      trim: true,
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      set: function (value) {
        return Math.round(value * 10) / 10;
      },
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    location: {
      type: String,
    },
    slug: {
      type: String,
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
//indexes for performance.
// tourSchema.index({ price: 1 });
tourSchema.index({
  startLocation: '2dsphere',
});
//document middleware
// tourSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });
//virtual
tourSchema.virtual('durationweeks').get(function () {
  return this.duration / 7;
});
tourSchema.pre(/^find/, async function (next) {
  this.populate({ path: 'guides' });
  next();
});

// this is virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

const tourModel = mongoose.model('Tour', tourSchema);
export default tourModel;
