import { Router } from "express";
import {
  createContact,
  createContactActivity,
  deleteContact,
  getContact,
  getContactActivities,
  getContacts,
  updateContact,
} from "../controllers/contacts.controller";

const router = Router();

router.post("/", createContact);
router.get("/", getContacts);
router.get("/:id", getContact);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);
// Contact activities
router.get("/:id/activities", getContactActivities);
router.post("/:id/activities", createContactActivity);

export default router;
