import dotenv from "dotenv";
import { z } from "zod";
import { ApiError } from "../utils/api-error";

dotenv.config({
  path: "./.env",
});

const envSchema = z.object({
  PORT: z.string().optional(),
  NODE_ENV: z.string().optional(),
  MONGO_URI: z.string(),
  ACCESS_TOKEN_KEY: z.string(),
  ACCESS_TOKEN_EXPIRY: z.string(),
  REFRESH_TOKEN_KEY: z.string(),
  REFRESH_TOKEN_EXPIRY: z.string(),
  MAIL_TRAP_HOST: z.string(),
  MAIL_TRAP_USERNAME: z.string(),
  MAIL_TRAP_PASSWORD: z.string(),
  CLOUDINARY_API_KEY: z.string(),
});

const createEnv = (env: NodeJS.ProcessEnv) => {
  const validationCheck = envSchema.safeParse(env);

  if (!validationCheck.success) {
    throw new ApiError(400, `ERROR: ${env} validation failed`, [
      validationCheck.error,
    ]);
  }

  return validationCheck.data;
};

export const env = createEnv(process.env);
