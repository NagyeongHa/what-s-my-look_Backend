import { Request, Response } from "express";
import * as LikeModel from "../models/like";

export const upLike = async (req: Request, res: Response) => {
  const like = req.body;
  const data = LikeModel.upLike(like);
  res.status(201).json(data);
};
