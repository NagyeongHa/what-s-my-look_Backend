import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import * as UserModel from "../models/user";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    //먼저 가입된 유효한 유저인지 체크를 위해 유저 정보 가져옴 (요청에서 보내주는 토큰 이용)
    const token = req.cookies.token;
    console.log("token", token);

    if (!token) return next();

    //verify 메소드와 jwt secret을 이용해서 토큰 Decode
    const id = verifyToken(token);

    if (!id) throw new Error("token 의 id가 없습니다");

    //토큰에서 나온 유저 이름을 이용해서 유저 정보 디비에서 가져옴
    const user = await UserModel.findUserInfoBySns_id(id);
    console.log("user", user);

    //유저 정보가 없다면 throw error
    if (!user) throw new Error("Unauthenticated");

    //유저 정보를 res.locals.user에 넣어줌
    res.locals.user = user;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Something went wrong" });
  }
};
