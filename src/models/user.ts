import { FieldPacket } from "mysql2";
import db from "../config/mysql";
import { UserProperty } from "../type/UserProperty";

//구글,네이버,카카오별로 id값이 존재하는지
export const isExistId = async (sns_id: number | string, type: string) => {
  try {
    const [rows]: [UserProperty[], FieldPacket[]] = await db.execute(
      `SELECT sns_id FROM user WHERE sns_id= ? AND TYPE = ?`,
      [sns_id, type]
    );

    if (rows[0].sns_id) {
      return rows[0].sns_id;
    }
    throw new Error();
  } catch (error) {
    return false;
  }
};

//회원가입
export const create = async (newUser: UserProperty) => {
  const { sns_id, name, profileimage, type } = newUser;

  try {
    await db.execute(
      `INSERT INTO user (sns_id, name, profileimage, type) VALUES (?,?,?,?)`,
      [sns_id, name, profileimage, type]
    );

    return sns_id;
  } catch (error) {
    console.log("Query error: ", error);
    if (error instanceof Error && error.message === "ER_DUP_ENTRY") {
      throw new Error("아이디가 중복됩니다");
    }
  }
};

//sns_id로 회원정보 가져오기
export const findUserInfoBySns_id = async (sns_id: number | string) => {
  try {
    const [rows]: [UserProperty[], FieldPacket[]] = await db.execute(
      `SELECT * FROM user WHERE sns_id = ? `,
      [sns_id]
    );
    return rows[0];
  } catch (error) {
    console.log("findUserInfoBySns_id query error:", error);
  }
};
