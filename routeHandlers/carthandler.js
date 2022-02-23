import cartModel from '../models/cartModel.js';
export const getcart = async (req, res) => {
  const carts = await cartModel.find();
  if (carts.length === 0) {
    res.status(200).json({
      status: 'success',
      message: 'sorry no data to return',
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        carts,
      },
    });
  }
};
export const postcart = async (req, res) => {
  try {
    const cartObject = req.body.cartData;
    console.log(cartObject);
    //get all the cart items
    const carts = await cartModel.find();

    //check if the item already exists or not
    const isExistItem = carts.find(
      (Element) => Element.name === cartObject.name
    );
    //if exist then just update the cart item

    if (isExistItem) {
      const quantity = isExistItem.quantity + 1;
      const totalPrice = isExistItem.totalPrice + isExistItem.price;
      const totalQuantity = isExistItem.totalQuantity + 1;

      const updatedCart = await cartModel.findByIdAndUpdate(
        isExistItem.id,
        {
          quantity: quantity,
          totalPrice: totalPrice,
          totalQuantity: totalQuantity,
        },
        { new: true }
      );

      res.status(201).json({
        status: 'success',
        data: {
          message: 'updated',
          updatedCart,
        },
      });
    }
    //if does not exist,then add item to the cart
    const newCart = await cartModel.create(req.body);
    //send back the response
    res.status(201).json({
      status: 'success',
      data: {
        newCart,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
