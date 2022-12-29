import express from "express";
import * as controller from "../controller/oauth";
import userMiddleware from "../middlewares/user";

const router = express.Router();

//회원가입, 로그인 시 refresh Token 발행
router.get("/silent-refresh", userMiddleware, controller.silent_refresh);

router.post("/logout", userMiddleware, controller.logout);
// kakao , naver , google param 으로 받아서 처리
router.get("/:company", controller.getAuthorizationCode);
router.post("/:company/callback", controller.callBack);

export default router;
