// src/middlwares/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export interface JwtPayload {
  id: number;
  role: string;
  firstName: string;
  lastName: string;
}

export const authorizeRole = (roles: string[]): ((req: Request & { user?: JwtPayload }, res: Response, next: NextFunction) => void) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      return;
    }
    next();
  };
};

export const authenticateToken = (
    req: Request & { user?: JwtPayload },
    res: Response,
    next: NextFunction
  ): void => {

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
  
    if (!token) {
      res.status(401).json({ message: 'Access denied. No token provided.' });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      req.user = decoded;
      next(); // Викликаємо next() для передачі контролю наступному middleware
    } catch (err) {
      res.status(403).json({ message: 'Invalid token.' });
      return;
    }
};
  