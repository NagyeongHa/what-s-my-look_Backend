import { FieldPacket } from "mysql2";
import db from "../config/mysql";
import { ErrorInfo } from "../type/ErrorInfo";
import { CountLikes, likeProperty } from "../type/Like";

//좋아요 +1
export const upLike = async (likeParam: likeProperty) => {
  const { sns_id, post_id } = likeParam;
  const findLikeQuery =
    "SELECT IFNULL (MAX(like_id),0) like_id FROM likes where sns_id = ? AND post_id = ?";
  const saveLikeQuery = "INSERT INTO likes (sns_id, post_id) VALUES(?,?)";

  try {
    const [rows]: [CountLikes[], FieldPacket[]] = await db.execute(
      findLikeQuery,
      [sns_id, post_id]
    );

    if (rows[0].like_id > 0) {
      return;
    }

    const [result] = await db.execute(saveLikeQuery, [sns_id, post_id]);
    return result;
  } catch (error) {
    const err = error as ErrorInfo;
    console.log("like upLike query error: ", err.code);
    return err.code;
  }
};

//좋아요 -1
export const unLike = async (likeParam: likeProperty) => {
  const { sns_id, post_id } = likeParam;
  const query = "DELETE FROM likes WHERE sns_id = ? AND post_id = ?;";

  try {
    const [rows] = await db.execute(query, [sns_id, post_id]);
    console.log(JSON.stringify(rows));
    return rows;
  } catch (error) {
    const err = error as ErrorInfo;
    console.log("like unLike query error: ", err.code);
    return err.code;
  }
};

//post_id 별 좋아요 개수
export const countLikes = async (post_id: number) => {
  const query = "SELECT COUNT(*) as total FROM likes WHERE post_id = ?;";

  try {
    const [rows]: [CountLikes[], FieldPacket[]] = await db.execute(query, [
      post_id,
    ]);
    return rows[0].total;
  } catch (error) {
    console.log("like countLikes query error: ", error);
  }
};

//로그인 유저의 좋아요 여부
//좋아요 없으면 0, 있으면 1
export const alreadyLiked = async ({ post_id, sns_id }: likeProperty) => {
  const query =
    "SELECT IFNULL (MAX(like_id),0) like_id FROM likes WHERE sns_id = ? AND post_id in (?);";

  try {
    const [rows]: [CountLikes[], FieldPacket[]] = await db.execute(query, [
      sns_id,
      post_id,
    ]);

    const result = rows[0].like_id > 0 ? 1 : 0;
    return result;
  } catch (error) {
    console.log("like alreadyLiked query error: ", error);
  }
};

//내가 좋아요한 게시글 모아보기
export const findLikePostBySnsId = async (sns_id: string) => {
  const query =
    "SELECT p.* FROM post p INNER JOIN likes l ON p.post_id = l.post_id WHERE l.sns_id = ?;";
  try {
    const [rows] = await db.execute(query, [sns_id]);
    return rows;
  } catch (error) {
    console.log("like findLikePostBySnsId query error: ", error);
  }
};
