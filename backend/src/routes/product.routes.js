import express from "express";
import { validateObjectId } from "../middleware/validate.middleware.js";
import {
  getAllProducts,
  getProductById,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getAllProducts);

router.get("/:id", validateObjectId("id"), getProductById);

export default router;
