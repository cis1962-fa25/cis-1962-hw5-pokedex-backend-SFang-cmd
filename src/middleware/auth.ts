import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        pennkey: string;
      };
    }
  }
}

// authentication middleware to verify JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Authorization header is missing or incorrect"
    });
  }

  // grab token payload
  const bearer = authHeader && authHeader.split(' ')[0];
  const token = authHeader && authHeader.split(' ')[1];

  if (bearer !== 'Bearer') {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "token format is incorrect"
    });
  }

  if (!token) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Token is required"
    });
  }

  const JWT_SECRET = process.env.JWT_SECRET!;
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Invalid token"
      });
    }
    req.user = user as { pennkey: string };
    next();
  });
};