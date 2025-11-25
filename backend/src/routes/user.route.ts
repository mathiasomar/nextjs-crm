import { Router } from "express";
import { createUser, getUser, getUsers } from "../controllers/user.controller";
import { shouldBeUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUser);

export default router;
