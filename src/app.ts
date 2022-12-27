import express, { Request, Response } from "express";
import cors from "cors";
import postRouter from "./routes/post";
import likeRouter from "./routes/like";
import oauthRouter from "./routes/oauth";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

app.use("/post", postRouter);
app.use("/like", likeRouter);
app.use("/oauth", oauthRouter);

app.get("/", (req: Request, res: Response) => {
  res.send(`welcome ${process.env.NODE_ENV}`);
});

app.listen(PORT, () => {
  console.log(`server is listening at ${PORT}`);
});
