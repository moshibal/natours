import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
//this code is for dirname as esmodule system doesnot support this.
import path from 'path';
export const __dirname = path.resolve();
import tourModel from './models/tourModel.js';
import userModel from './models/userModel.js';
import reviewModel from './models/reviewModel.js';
//Import the mongoose module
import mongoose from 'mongoose';

//Set up default mongoose connection
mongoose
  .connect(process.env.MONGOCONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('database connected successfully.');
  });
const tourdata = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours.json`)
);
const userdata = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
);
const reviewdata = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/reviews.json`)
);

const insertData = async () => {
  await tourModel.create(tourdata);
  await userModel.create(userdata, { validateBeforeSave: false });
  await reviewModel.create(reviewdata);
  // console.log('successfully added data..');
  process.exit();
};
const deleteAllData = async () => {
  await tourModel.deleteMany();
  await userModel.deleteMany();
  await reviewModel.deleteMany();
  // console.log('successfully deleted data..');
  process.exit();
};
try {
  console.log(process.argv);
  if (process.argv[2] === 'insert') {
    insertData();
  } else if (process.argv[2] === 'delete') {
    deleteAllData();
  }
} catch (error) {
  console.log(error);
  process.exit();
}
