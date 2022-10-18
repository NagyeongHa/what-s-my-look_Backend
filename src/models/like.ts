import db from "../config/mysql";

export interface likeProperty {
  sns_id: string;
  post_id: number;
}
export const upLike = async (newLike: likeProperty) => {
  const { sns_id, post_id } = newLike;
  const query = "INSERT INTO likes (sns_id, post_id) VALUES(?,?);";
  try {
    const [rows] = await db.execute(query, [sns_id, post_id]);
    return rows;
  } catch (error) {
    console.log("like upLike query error: ", error);
  }
};
