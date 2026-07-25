import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Das JWT_SECRET fehlt!");
}

export const register = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};

export const login = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};

export const logout = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};

export const getMe = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};
