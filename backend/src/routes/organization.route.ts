import { Router } from "express";
import {
  createOrganization,
  createOrganizationUser,
  getOrganizationMe,
  getOrganizations,
} from "../controllers/organization.controller";
import { shouldBeUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/", createOrganization);
router.get("/", getOrganizations);
router.get("/me", shouldBeUser, getOrganizationMe);
router.post("/user", shouldBeUser, createOrganizationUser);

export default router;
