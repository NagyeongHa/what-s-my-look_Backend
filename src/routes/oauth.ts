import express from "express";
import * as controller from "../controller/oauth";

const router = express.Router();

//회원가입, 로그인 시 refresh Token 발행
router.post("/silent-refresh", controller.silent_refresh);

// kakao , naver , google param 으로 받아서 처리
router.get("/:company", controller.getAuthorizationCode);
router.get("/:company/callback/:code/:state", controller.callBack);

export default router;
