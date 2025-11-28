import { Router } from "express";
import {
  createOpportunity,
  createOpportunityClose,
  createOpportunityProducts,
  getOpportunities,
  updateOppotunity,
} from "../controllers/oppotunity.controller";

const router = Router();

router.post("/", createOpportunity);
router.post("/:id/products", createOpportunityProducts);
router.post("/:id/close", createOpportunityClose);
router.get("/", getOpportunities);
router.patch("/:id", updateOppotunity);

export default router;
