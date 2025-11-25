import { Router } from "express";
import {
  createOpportunity,
  getOpportunities,
  updateOppotunity,
} from "../controllers/oppotunity.controller";

const router = Router();

router.post("/", createOpportunity);
router.get("/", getOpportunities);
router.patch("/:id", updateOppotunity);

export default router;
