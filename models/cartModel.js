import mongoose from 'mongoose';
//create the schema
const cartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  quantity: Number,
  totalPrice: Number,

  totalQuantity: Number,
});
//create the model
const cartModel = mongoose.model('cart', cartSchema);
export default cartModel;
