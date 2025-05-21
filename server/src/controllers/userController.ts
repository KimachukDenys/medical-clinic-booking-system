import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  constructor(private userService: UserService) {}

  registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.registerUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.userService.loginUser(email, password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const user = await this.userService.getUserProfile(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  editUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const data = req.body;
      const photoFileName = req.file ? req.file.filename : undefined;

      const updatedUser = await this.userService.editUserProfile(userId, { ...data, photoFileName });
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };
};
