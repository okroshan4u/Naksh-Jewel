import express from "express";
// import { signup, login } from "../controllers/auth.controller.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { signup, login, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";



const router = express.Router();

router.post(
    "/signup",
    validateBody(["name", "email", "password"]),
    signup
);

router.post(
    "/login",
    validateBody(["email", "password"]),
    login
);

router.get("/me", protect, getMe);

export default router;
