import type { IUser } from "../../models/auth.model";

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}
