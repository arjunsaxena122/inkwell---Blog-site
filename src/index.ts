import app from "./app";
import { env } from "./config/config";
import connectDB from "./db/db";
import { ApiError } from "./utils/api-error";

const port = Number(env.PORT) ?? 3000;

connectDB()
  .then(() =>
    app.listen(port, () => {
      console.log(`Server running at port ${port}`);
    }),
  )
  .catch((err) => {
    throw new ApiError(503, `ERROR:Database conneciton failed: ${err}`, [err]);
  });
