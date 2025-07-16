import express, { Application } from "express";
import { customErrorHandler } from "./middlewares/error.middleware";

const app: Application = express();

app.use(customErrorHandler);

export default app;
