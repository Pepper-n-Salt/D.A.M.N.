import { Router } from "express";

import { sendContactForm } from "../controllers/contactController";

import validateContact from "../middleware/validateContact";

const router = Router();

/*
POST

/api/contact

Ablauf:

Request
 ↓
Validation
 ↓
Controller
 ↓
MailService
 ↓
Google SMTP
*/

router.post(
  "/",

  validateContact,

  sendContactForm
);

export default router;
