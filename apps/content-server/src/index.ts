import "../config.ts";
import express, { Application, Response } from "express";
import router from "./router";

const PORT = process.env.port ?? 5005;

const app: Application = express();

const SERVING_PATH = process.env.SERVING_PATH ?? "public";

app.use(
  "/f",
  express.static(SERVING_PATH, {
    dotfiles: "ignore",
    etag: true,
    index: false, // directory indexing
    maxAge: "7d",
    redirect: false,
    setHeaders: (res: Response) => {
      res.set("x-timestamp", Date.now().toString());
    },
  }),
);

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Home");
});

app.listen(PORT, () => {
  if (process.env.DEVELOPMENT)
    console.log(`Listening on http://localhost:${PORT}`);
});
