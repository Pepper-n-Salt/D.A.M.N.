import express from "express";
// hier später die auth-controller functions importieren
// an dieser Stelle später die Auth Middleware importieren

const router = express.Router();

router.post("/register", () => {}); // brauchen wir diese überhaupt? haben wir ja bisher nicht in die Oerfläche mit eingeplant.
router.post("/login", () => {});
router.post("/logout", () => {}); // hier keine middleware checkAuth, damit logout unter allen umständen funktioniert

// route für aktuelle:n user:in, um eingelogged zu bleiben // noch middleware checkAuth und getProfile-controller-function einfügen
router.get(
  "/profile",
  () => {},
  () => {}
);

export default router;
