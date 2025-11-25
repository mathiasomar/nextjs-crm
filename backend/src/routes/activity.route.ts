import { Router } from "express";
import {
  createActivity,
  getActivity,
} from "../controllers/activity.controller";

const router = Router();

router.post("/", createActivity);
router.get("/:id", getActivity);

export default router;
