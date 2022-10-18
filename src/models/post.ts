import db from "../config/mysql";
import { Post } from "../type/Post";

//게시글 작성
export const create = async (post: Post) => {
  const { sns_id, content, imagepath, temperature, style } = post;
  const query =
    "INSERT INTO post (sns_id, content, imagepath, temperature, style,regdate,moddate) VALUES(?,?,?,?,?,NOW(),NOW())";

  try {
    const [rows] = await db.execute(query, [
      sns_id,
      content,
      imagepath,
      temperature,
      style,
    ]);

    return rows;
  } catch (error) {
    console.log("post create query error:", error);
  }
};

//게시글 수정
export const update = async (post: Post) => {
  const { content, imagepath, temperature, style, post_id } = post;
  const query =
    "UPDATE post SET content = ?, imagepath = ?, temperature = ?, style = ?, moddate = NOW() WHERE post_id = ?";

  try {
    const [rows] = await db.execute(query, [
      content,
      imagepath,
      temperature,
      style,
      post_id,
    ]);

    return rows;
  } catch (error) {
    console.log("post update query error: ", error);
  }
};

//게시글 삭제
export const remove = async (post_id: number) => {
  const query = "DELETE FROM post WHERE post_id = ?";

  try {
    const [rows] = await db.execute(query, [post_id]);
    return rows;
  } catch (error) {
    console.log("post remove query error: ", error);
  }
};

// 온도,스타일별 전체 이미지 조회
export const findByTemperatureAndStyle = async (
  queryString: Pick<Post, "temperature" | "style">
) => {
  const { temperature, style } = queryString;

  const query = !style
    ? `SELECT * FROM post WHERE temperature BETWEEN ${temperature - 2} AND ${
        temperature + 2
      }`
    : `SELECT * FROM post WHERE temperature BETWEEN ${temperature - 2} AND ${
        temperature + 2
      } AND style=${style}`;

  try {
    const [rows] = await db.execute(query);
    return rows;
  } catch (error) {
    console.log("post findByTemperatureAndStyle query error: ", error);
  }
};

// post_id로 게시글 1개 조회
export const findByPostId = async (post_id: number) => {
  const query = "SELECT * FROM post WHERE post_id = ?";
  try {
    const [rows] = await db.execute(query, [post_id]);
    return rows;
  } catch (error) {
    console.log("post findByPostId query error: ", error);
  }
};
