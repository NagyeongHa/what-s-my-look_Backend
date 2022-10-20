import { Request, Response } from "express";
import * as LikeModel from "../models/like";

//좋아요 +1
export const upLike = async (req: Request, res: Response) => {
  const likeParam = req.body; //sns_id, post_Id
  const data = await LikeModel.upLike(likeParam);
  res.status(201).json(data);
};

//좋아요 -1
export const unLike = async (req: Request, res: Response) => {
  const likeParam = req.body; //sns_id, post_Id
  await LikeModel.unLike(likeParam);
  res.status(200).end();
};

//좋아요 개수 및 좋아요 여부
export const findCountAndAlreadyLiked = async (req: Request, res: Response) => {
  const post_id: number = parseInt(req.params.post_id);
  const { sns_id } = req.params;

  const countLikes = await LikeModel.countLikes(post_id);
  const alreadyLiked = await LikeModel.alreadyLiked({ post_id, sns_id });
  const data = { total: countLikes, alreadyLiked };
  res.status(200).json(data);
};

//내가 좋아요한 게시글 모아보기
export const findLikePostBySnsId = async (req: Request, res: Response) => {
  const { sns_id } = req.params;
  const data = await LikeModel.findLikePostBySnsId(sns_id);
  res.status(200).json(data);
};
