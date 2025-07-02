import express from "express";
import { router } from "./routes";

const app = express();

app.use(express.json());

app.use("/auth", router.authRouter)
app.use("/website", router.websiteRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});