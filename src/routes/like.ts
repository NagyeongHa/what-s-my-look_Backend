import express from "express";
import * as controller from "../controller/like";

const router = express.Router();

//좋아요 +1
router.post("/", controller.upLike);

export default router;
