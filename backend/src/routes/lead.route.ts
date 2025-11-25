import { Router } from "express";
import {
  convertLead,
  createLead,
  getLead,
  getLeads,
} from "../controllers/leads.controller";

const router = Router();

router.post("/", createLead);
router.get("/", getLeads);
router.get("/:id", getLead);
router.put("/:id/convert", convertLead);

export default router;
