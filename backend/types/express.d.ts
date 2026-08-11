declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        organisationId: string;
        role: "super" | "admin" | "user";
      };
    }
  }
}

export {};
