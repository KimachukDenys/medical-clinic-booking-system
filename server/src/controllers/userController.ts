import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  constructor(private userService: UserService) {}

  registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.userService.registerUser(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.message.startsWith('ValidationError')) {
        res.status(400).json({ message: error.message.replace('ValidationError: ', '') });
      } else if (error.message.startsWith('ConflictError')) {
        res.status(409).json({ message: error.message.replace('ConflictError: ', '') });
      } else {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    }
  };

  loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.userService.loginUser(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message.startsWith('AuthError')) {
        res.status(400).json({ message: error.message.replace('AuthError: ', '') });
      } else {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    }
  };

  getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const user = await this.userService.getUserProfile(id);
      res.status(200).json(user);
    } catch (error: any) {
      if (error.message.startsWith('ValidationError')) {
        res.status(400).json({ message: error.message.replace('ValidationError: ', '') });
      } else if (error.message.startsWith('NotFoundError')) {
        res.status(404).json({ message: error.message.replace('NotFoundError: ', '') });
      } else {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    }
  };
}