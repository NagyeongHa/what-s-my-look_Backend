import express from "express";
import * as controller from "../controller/post";
const router = express.Router();

//게시글 작성
router.post("/", controller.create);

//게시글 수정
router.put("/", controller.update);

//게시글 삭제
router.delete("/:post_id", controller.remove);

// 온도,스타일별 전체 게시글 조회
router.get("/image", controller.findByTemperatureAndStyle);

// post_id로 게시글 1개 조회
router.get("/:post_id", controller.findByPostId);

export default router;
