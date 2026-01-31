import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddlewareOptional(
  req: any,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decoded;
    } catch {}
  }

  next();
}
