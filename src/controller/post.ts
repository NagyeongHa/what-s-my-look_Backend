import { Request, Response } from "express";
import * as PostModel from "../models/post";
import { Post } from "../type/Post";

//게시글 작성
export const create = async (req: Request, res: Response) => {
  const post = req.body;
  const data = await PostModel.create(post);
  res.status(201).json(data);
};

//게시글 수정
export const update = async (req: Request, res: Response) => {
  const post = req.body;
  const data = await PostModel.update(post);
  res.status(200).json(data);
};

//게시글 삭제
export const remove = async (req: Request, res: Response) => {
  const post_id: number = parseInt(req.params.post_id);
  await PostModel.remove(post_id);
  res.status(200).end();
};

// 온도, 스타일별 전체 게시글 조회
export const findByTemperatureAndStyle = async (
  req: Request<unknown, unknown, unknown, Pick<Post, "temperature" | "style">>,
  res: Response
) => {
  const { query } = req;
  const posts = await PostModel.findByTemperatureAndStyle(query);
  res.status(200).json(posts);
};

// post_id로 게시글 1개 조회
export const findByPostId = async (req: Request, res: Response) => {
  const post_id: number = parseInt(req.params.post_id);
  const post = await PostModel.findByPostId(post_id);
  res.status(200).json(post);
};
