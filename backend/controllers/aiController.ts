export const chat = async (res: Response, req: Request) => {
  try {
  } catch (e) {
    console.error("AI chat error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
};
