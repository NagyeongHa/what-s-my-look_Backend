import express, { Request, Response } from "express";
import cors from "cors";
import postRouter from "./routes/post";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

app.use("/post", postRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("welcome");
});

app.listen(PORT, () => {
  console.log(`server is listening at ${PORT}`);
});
