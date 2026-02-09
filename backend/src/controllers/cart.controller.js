import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// helper: get or create cart
const getCartDoc = async () => {
  let cart = await Cart.findOne().populate("items.product");
  if (!cart) {
    cart = await Cart.create({ items: [] });
  }
  return cart;
};

// GET /cart
export const getCart = async (req, res, next) => {
  try {
    const cart = await getCartDoc();
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// POST /cart/add
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (quantity <= 0) {
      const err = new Error("Quantity must be greater than 0");
      err.statusCode = 400;
      throw err;
    }

    const product = await Product.findById(productId);
    if (!product) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    const cart = await getCartDoc();

    const itemIndex = cart.items.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate("items.product");

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// PUT /cart/update
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity <= 0) {
      const err = new Error("Quantity must be greater than 0");
      err.statusCode = 400;
      throw err;
    }

    const cart = await getCartDoc();

    const item = cart.items.find(
      (item) => item.product._id.toString() === productId
    );

    if (!item) {
      const err = new Error("Item not found in cart");
      err.statusCode = 404;
      throw err;
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.product");

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// DELETE /cart/remove/:productId
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await getCartDoc();

    cart.items = cart.items.filter(
      (item) => item.product._id.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.product");

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// DELETE /cart/clear
export const clearCart = async (req, res, next) => {
  try {
    const cart = await getCartDoc();
    cart.items = [];
    await cart.save();

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};
