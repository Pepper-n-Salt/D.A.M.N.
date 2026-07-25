import express from "express";
// hier später die user-controller functions importieren
// an dieser Stelle später die Auth Middleware importieren

const router = express.Router();

router.get(
  "/:userId",
  () => {},
  () => {}
); // zum Abrufen der:s User:in zur Darstellung in User Form?
router.post(
  "/register",
  () => {},
  () => {}
); // zum Anlegen von neuen User:innen in der User Form

export default router;
