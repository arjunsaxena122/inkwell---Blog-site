import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { customErrorHandler } from "./middlewares/error.middleware";

const app: Application = express();

// ? Middlewares

const options = {
  origin: ["*"],
  methods: ["GET", "POST", "DELETE", "PUT", "UPDATE"],
  credential: true,
};
app.use(cors(options));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ? Routes




// ? Error Middleware
app.use(customErrorHandler);

export default app;
