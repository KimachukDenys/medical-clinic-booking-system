// src/types/express.d.ts
import 'express'; // додаємо це, якщо його немає

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

export {}; // Важливо для того, щоб TypeScript правильно зрозумів, що це модифікація модулю
