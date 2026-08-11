import type { AuthUser } from "./auth.types.js";
// global gesetzte Typ-Erweiterungen müssen nicht nochmal in die jeweiligen Datei importiert werden, also hier nicht noch in die checkAuth middleware
declare global {
  namespace Express {
    // Declaration Merging
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
