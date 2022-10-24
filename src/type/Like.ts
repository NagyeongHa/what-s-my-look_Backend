import { RowDataPacket } from "mysql2";

export interface likeProperty {
  sns_id: string;
  post_id: number;
}

export interface CountLikes extends RowDataPacket {
  count: number;
  like_id: number;
}
