import { Router } from "express";
import {
  createUser,
  getUser,
  getUsers,
  signIn,
} from "../controllers/user.controller";
import { shouldBeUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/signup", createUser);
router.post("/signin", signIn);
router.get("/", getUsers);
router.get("/:id", getUser);

export default router;
