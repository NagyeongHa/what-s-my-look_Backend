import express from "express";
import * as controller from "../controller/like";

const router = express.Router();

//좋아요 +1
router.post("/", controller.upLike);

//좋아요 -1
router.delete("/", controller.unLike);

//posts에 보낼 like 데이터
router.get("/check/:post_id/:sns_id", controller.findCountAndAlreadyLiked);

//내가 좋아요한 게시글 모아보기
router.get("/:sns_id", controller.findLikePostBySnsId);

export default router;
