import { RowDataPacket } from "mysql2";

export interface UserProperty extends RowDataPacket {
  sns_id: number | string;
  profileimage: string;
  name: string;
  type: string;
}
