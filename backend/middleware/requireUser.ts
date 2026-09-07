import { Request, Response, NextFunction } from "express";

import User, { IUser } from "../models/User";

export async function requireUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId: string = String(req.header("x-user-id") || "").trim();

  if (!userId) {
    res.status(401).json({ message: "You need to sign in again." });
    return;
  }

  try {
    const user: IUser | null = await User.findById(userId);

    if (!user) {
      res.status(401).json({ message: "That account no longer exists. Sign in again." });
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({ message: "Verify your e-mail before using the marketplace." });
      return;
    }

    req.currentUser = user;
    next();
  } catch {
    res.status(401).json({ message: "You need to sign in again." });
  }
}
