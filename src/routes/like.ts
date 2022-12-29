import express from "express";
import * as controller from "../controller/like";
import userMiddleware from "../middlewares/user";
const router = express.Router();

//좋아요 +1
router.post("/", userMiddleware, controller.upLike);

//좋아요 -1
router.delete("/", controller.unLike);
router.delete("/", userMiddleware, controller.unLike);

//posts에 보낼 like 데이터
router.get("/check/:post_id/:sns_id", controller.findCountAndAlreadyLiked);

//내가 좋아요한 게시글 모아보기
router.get("/:sns_id", userMiddleware, controller.findLikePostBySnsId);

export default router;
