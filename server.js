import app from './app.js';
import mongoose from 'mongoose';

const DB = process.env.MONGOCONSTRING;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || '1337';
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
process.on('SIGTERM', () => {
  console.log('server shouting down gracefully.. 😇');
  server.close(() => {
    console.log('process terminated');
  });
});
