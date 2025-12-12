import { Session } from "better-auth"; // or correct type for your session object

declare global {
  namespace Express {
    interface Request {
      user?: any;
      session?: any;
    }
  }
}
