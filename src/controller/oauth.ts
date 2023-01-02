import { Request, Response } from "express";
import { verifyToken, makeAccessToken, makeRefreshToken } from "../utils/jwt";
import axios from "axios";
import * as userModel from "../models/user";
import { UserProperty } from "../type/UserProperty";

const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth";
const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
const KAKAO_AUTH_REDIRECT_URL = process.env.KAKAO_REDIRECT_URI;
const KAKAO_AUTHORIZATION_CODE_URL = `${KAKAO_AUTH_URL}/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_AUTH_REDIRECT_URL}&response_type=code`;

const NAVER_AUTH_URL = "https://nid.naver.com/oauth2.0";
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const NAVER_AUTH_REDIRECT_URL = process.env.NAVER_REDIRECT_URI;
const STATE = "RANDOM_STATE";
const NAVER_AUTHORIZATION_CODE_URL = `${NAVER_AUTH_URL}/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${NAVER_AUTH_REDIRECT_URL}`;

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_AUTH_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URI;
const GOOGLE_AUTHORIZATION_CODE_URL = `${GOOGLE_AUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_AUTH_REDIRECT_URL}&response_type=code&include_granted_scopes=true&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;

/*==============================/:company==========================================*/

//인가코드 받기
export const getAuthorizationCode = async (req: Request, res: Response) => {
  const { company } = req.params;
  console.log("💛coperation", company);

  switch (company) {
    case "kakao":
      return res.redirect(KAKAO_AUTHORIZATION_CODE_URL);
      break;
    case "naver":
      return res.redirect(NAVER_AUTHORIZATION_CODE_URL);
      break;
    case "google":
      return res.redirect(GOOGLE_AUTHORIZATION_CODE_URL);
    default:
      return console.log("company not found");
      break;
  }
};

/*===============================/:company/callback====================================*/

class Kakao {
  tokenUrl: string;
  clientID?: string;
  clientSecret?: string;
  redirectUri?: string;
  userInfoUrl: string;
  code: string;
  state?: string;

  constructor(code: string, state: string) {
    this.tokenUrl = `${KAKAO_AUTH_URL}/token`;
    this.userInfoUrl = "https://kapi.kakao.com/v2/user/me";
    this.clientID = KAKAO_CLIENT_ID;
    this.redirectUri = KAKAO_AUTH_REDIRECT_URL;
    this.code = code;
    this.state = state;
  }
}

class Naver {
  tokenUrl: string;
  userInfoUrl: string;
  clientID?: string;
  clientSecret?: string;
  redirectUri?: string;
  code: string;
  state?: string;

  constructor(code: string, state: string) {
    this.tokenUrl = `${NAVER_AUTH_URL}/token`;
    this.userInfoUrl = "https://openapi.naver.com/v1/nid/me";
    this.clientID = NAVER_CLIENT_ID;
    this.clientSecret = NAVER_CLIENT_SECRET;
    this.redirectUri = NAVER_AUTH_REDIRECT_URL;
    this.code = code;
    this.state = state;
  }
}

class Google {
  tokenUrl: string;
  clientID?: string;
  clientSecret?: string;
  redirectUri?: string;
  userInfoUrl: string;
  code: string;
  state?: string;

  constructor(code: string) {
    this.tokenUrl = "https://oauth2.googleapis.com/token";
    this.userInfoUrl = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=`;
    this.clientID = GOOGLE_CLIENT_ID;
    this.clientSecret = GOOGLE_CLIENT_SECRET;
    this.redirectUri = GOOGLE_AUTH_REDIRECT_URL;
    this.code = code;
  }
}

//카카오 / 네이버 / 구글 선택
const getCompanyInfo = (company: string, code: string, state: string) => {
  switch (company) {
    case "kakao":
      return new Kakao(code, state);
      break;
    case "naver":
      return new Naver(code, state);
      break;
    case "google":
      return new Google(code);
    default:
      console.log("getCompanyInfo error");
      break;
  }
};

//토큰 받기
const getAccessToken = async (companyInfo: Kakao | Naver | Google) => {
  try {
    const { data } = await axios({
      method: "POST",
      url: companyInfo.tokenUrl,
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      params: {
        grant_type: "authorization_code",
        client_id: companyInfo.clientID,
        client_secret: companyInfo.clientSecret,
        redirect_uri: companyInfo.redirectUri,
        code: companyInfo.code,
        state: companyInfo?.state,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

//유저정보 받기
const getUserInfo = async (
  url: string,
  access_token: string,
  company: string
) => {
  try {
    const { data: me } = await axios({
      method: "GET",
      url: company === "google" ? url + access_token : url,
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${access_token}`,
        accept: "application/json",
      },
    });

    if (company === "kakao") {
      const { id, kakao_account } = me;

      const userInfo = {
        sns_id: id,
        name: kakao_account.profile.nickname,
        profileimage: kakao_account.profile.thumbnail_image_url,
        type: "kakao",
      };
      return userInfo;
    }

    if (company === "naver") {
      const userInfo = {
        sns_id: me.response.id,
        profileimage: me.response.profile_image,
        name: me.response.name,
        type: "naver",
      };
      return userInfo;
    }

    if (company === "google") {
      const { id, name, picture } = me;
      const userInfo = {
        sns_id: id,
        name: name,
        profileimage: picture,
        type: "google",
      };
      return userInfo;
    }
  } catch (error) {
    console.log(error);
  }
};

//callBack_uri 에서 토큰받음 -> 유저 정보 받음 ->  DB에 유저 정보 저장 -> 우리 사이트 전용 refresh token, access token 발급
export const callBack = async (req: Request, res: Response) => {
  const { company } = req.params;
  const { code } = req.body;
  const { state } = req.body;
  const companyInfo = getCompanyInfo(company, code, state);

  console.log("=======code", code);
  console.log("=======companyiNfo", companyInfo);

  if (!companyInfo) {
    throw new Error("missing companyInfo");
  }

  const token = await getAccessToken(companyInfo);
  console.log("💛token", token.access_token);

  const userInfo = await getUserInfo(
    companyInfo.userInfoUrl,
    token.access_token,
    company
  );
  console.log("💛userinfo:", userInfo);

  if (!userInfo) {
    throw new Error("missing userInfo");
  }

  try {
    // DB에 가입한 아이디가 있는 경우 -> 로그인 로직
    // user_id = 가입했으면 가입한 아이디를, 가입안했으면 false 를 return
    const user_id = await userModel.isExistId(userInfo.sns_id, userInfo.type);
    console.log("💛user_id:", user_id);

    if (user_id) {
      const refreshToken = makeRefreshToken(user_id);
      console.log("💛user_id_refreshToken:", refreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 24 * 14 * 1000,
      });
      return res.json({ user: userInfo });
    }

    const signUp_id = await userModel.create(userInfo as UserProperty);
    console.log("💛signUp_id:", signUp_id);

    if (signUp_id) {
      const refreshToken = makeRefreshToken(signUp_id);
      console.log("💛signUp_id_refreshToken:", refreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 24 * 14 * 1000,
      });
      return res.json({ user: userInfo });
    }
  } catch (error) {
    console.log("callBack Error", error);
  }
};

/*=============================/silent-refresh==========================================*/

//회원가입이나 로그인 프로세스를 진행 시 쿠키에 refresh Token 저장
//해당 refresh Token 을 기반으로 access Token 발급
export const silent_refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies["refreshToken"];

  //const refreshToken = "";

  if (!refreshToken) {
    return res.status(500).json({ message: "refreshToken is undefined" });
  }

  console.log("💛refreshToken:", refreshToken);

  const verifyAccessToken = verifyToken(refreshToken);
  console.log("💛verifyAccessToken:", verifyAccessToken);

  if (verifyAccessToken) {
    const accessToken = makeAccessToken(verifyAccessToken);
    const refreshToken = makeRefreshToken(verifyAccessToken);
    const userInfo = await userModel.findUserInfoBySns_id(verifyAccessToken);

    console.log("=======user", userInfo);
    console.log("=======accessToken", accessToken);
    console.log("=======refreshToken", refreshToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 14 * 1000,
    });
    return res.json({ accessToken, userInfo });
  }
  return res.status(401).json({ message: "refreshToken is invalid" });
};

//logout
export const logout = (req: Request, res: Response) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 0,
  });

  res.status(200).json({ success: true });
};
