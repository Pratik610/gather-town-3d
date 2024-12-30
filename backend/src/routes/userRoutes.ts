import express from "express";
import { userLogin, getUserDetails } from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/login", userLogin);
router.get("/", protect, getUserDetails);

export default router;
