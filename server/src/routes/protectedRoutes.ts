import express, { Request, Response, NextFunction } from 'express';

import { authenticateToken } from '../middlwares/auth';
import { JwtPayload } from '../middlwares/auth'; // змінити на правильний шлях



const router = express.Router();

router.get('/profile', authenticateToken, (req: Request & { user?: JwtPayload }, res: Response) => {
  res.json({ message: 'This is protected data!', user: req.user });
});


export default router;
