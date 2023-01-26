import { Request, Response } from "express";
import * as LikeModel from "../models/like";
import { Post } from "../type/Post";

//좋아요 +1
export const upLike = async (req: Request, res: Response) => {
  const likeParam = req.body; //sns_id, post_Id
  const data = await LikeModel.upLike(likeParam);
  if (data === "ER_NO_REFERENCED_ROW_2") {
    return res.json({ message: "sns_id is not valid" });
  }
  res.status(201).json(data);
};

//좋아요 -1
export const unLike = async (req: Request, res: Response) => {
  const likeParam = req.body; //sns_id, post_Id
  const data = await LikeModel.unLike(likeParam);
  if (data === "ER_NO_REFERENCED_ROW_2") {
    return res.json({ message: "sns_id is not valid" });
  }
  res.status(201).json(data);
};

//좋아요 개수 및 좋아요 여부
export const findCountAndAlreadyLiked = async (
  req: Request<unknown, unknown, unknown, Pick<Post, "post_id" | "sns_id">>,
  res: Response
) => {
  const { sns_id, post_id } = req.query;

  const countLikes = await LikeModel.countLikes(post_id);
  const alreadyLiked = await LikeModel.alreadyLiked({ post_id, sns_id });

  if (!sns_id) {
    const data = { total: countLikes };
    return res.status(200).json(data);
  }
  const data = { total: countLikes, alreadyLiked };
  return res.status(200).json(data);
};

//내가 좋아요한 게시글 모아보기
export const findLikePostBySnsId = async (req: Request, res: Response) => {
  const { sns_id } = req.params;
  const data = await LikeModel.findLikePostBySnsId(sns_id);
  res.status(200).json(data);
};
