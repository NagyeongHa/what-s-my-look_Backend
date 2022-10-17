import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("welcome");
});

app.listen(PORT, () => {
  console.log(`server is listening at ${PORT}`);
});
