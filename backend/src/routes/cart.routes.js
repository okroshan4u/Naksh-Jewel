import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";

import { validateBody } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", getCart);

router.post(
  "/add",
  validateBody(["productId"]),
  addToCart
);

router.put(
  "/update",
  validateBody(["productId", "quantity"]),
  updateCartItem
);

router.delete("/remove/:productId", removeFromCart);
router.delete("/clear", clearCart);

export default router;
