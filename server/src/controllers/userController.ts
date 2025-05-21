import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { UserService } from '../services/userService';

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  registerUser   = (req: Request, res: Response, next: NextFunction) =>
    this.userService.registerUser(req.body)
      .then(result => res.status(201).json(result))
      .catch(next);

  loginUser      = (req: Request, res: Response, next: NextFunction) =>
    this.userService.loginUser(req.body.email, req.body.password)
      .then(result => res.status(200).json(result))
      .catch(next);

  getUserProfile = (req: Request, res: Response, next: NextFunction) =>
    this.userService.getUserProfile(Number(req.params.id))
      .then(user => res.status(200).json(user))
      .catch(next);

  editUserProfile = (req: Request, res: Response, next: NextFunction) => {
    const userId = Number(req.params.id);
    const data   = { ...req.body, photoFileName: req.file?.filename };
    this.userService.editUserProfile(userId, data)
      .then(u => res.status(200).json(u))
      .catch(next);
  };
}
