import { Router } from "express";
import {
  deleteManyUser,
  getUser,
  getUsers,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/delete-users", deleteManyUser);

export default router;
