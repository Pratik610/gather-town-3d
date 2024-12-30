import express from "express";
import {createWorkSpace,getAllWorkSpace} from '../controllers/workspaceController'
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/create", protect,createWorkSpace);
router.get("/", protect,getAllWorkSpace);


export default router;
