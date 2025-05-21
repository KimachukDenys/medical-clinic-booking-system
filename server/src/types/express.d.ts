import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
        firstName: string;
        lastName: string;
      };
    }
  }
}

export {};
