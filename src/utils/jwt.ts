import * as jwt from "jsonwebtoken";
import { ErrorInfo } from "../type/ErrorInfo";

declare module "jsonwebtoken" {
  export interface UserIDJwtPayload extends jwt.JwtPayload {
    id: string;
  }
}

//토큰 유효성 검증
export const verifyToken = (token: string) => {
  try {
    const { id } = <jwt.UserIDJwtPayload>jwt.verify(token, "PASSWORD");
    console.log("💛token id:", id);
    return id;
  } catch (error) {
    // const err = error as ErrorInfo;
    // return err.name;
    console.log("토큰오류", error);
    return false;

    // // TokenExpiredError
    // // 기간 만료
    // if (err.name === "TokenExpiredError") {
    //   console.log(error);
    // }

    // // JsonWebTokenError
    // // 서명이 유효하지 않거나 수정된 경우
    // if (err.name === "JsonWebTokenError") {
    //   console.log(error);
    // }

    // // NotBeforeError
    // // jwt형식이 아닌경우
    // if (err.name === "NotBeforeError") {
    //   console.log(error);
    // }

    // console.log("token error", error);
    // return false;
  }
};

// access 토큰
// 유효기간 2시간
// cookie에 있는 RefreshToken 으로 매 요청마다 로그인 수행
export const makeAccessToken = (id: string | number) => {
  try {
    return jwt.sign({ id: id }, "PASSWORD", { expiresIn: "2h" });
  } catch (error) {
    console.log(error);
  }
};

// refresh 토큰
// 유효기간 2주
export const makeRefreshToken = (id: string | number) => {
  try {
    return jwt.sign({ id: id }, "PASSWORD", { expiresIn: "14d" });
  } catch (error) {
    return "error";
  }
};
