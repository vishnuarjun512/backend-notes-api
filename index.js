import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer } from "http";
import notesRouter from "./routers/notes.router.js";
import userRouter from "./routers/user.router.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./documentation/config.js";
dotenv.config();

const app = express();
const server = createServer(app);
app.use(cookieParser());
app.use(express.json());

//Swagger Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api/", (req, res) => {
  try {
    res.status(200).json({ message: "Test Done" });
  } catch (error) {
    res.status(404).json({ message: "Test Failed" });
  }
});
app.use("/api/notes/", notesRouter);
app.use("/api/user/", userRouter);

export { app, server };
export default app;
