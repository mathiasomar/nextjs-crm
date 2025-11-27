import { Router } from "express";
import {
  convertLeadToContact,
  createLead,
  getLead,
  getLeads,
} from "../controllers/leads.controller";

const router = Router();

router.post("/", createLead);
router.get("/", getLeads);
router.get("/:id", getLead);
router.post("/:id/convert", convertLeadToContact);

export default router;
