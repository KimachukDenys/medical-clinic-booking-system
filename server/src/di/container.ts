import 'reflect-metadata';
import { container } from 'tsyringe';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import { UserService } from '../services/userService';
import { UserController } from '../controllers/userController';


container.register('Bcrypt',    { useValue: bcrypt });
container.register('Jwt',       { useValue: jwt  });
container.register('JwtSecret', { useValue: process.env.JWT_SECRET || 'your_jwt_secret' });
container.register('UserModel', { useValue: User });

container.register(UserService,   { useClass: UserService });
container.register(UserController,{ useClass: UserController });

export { container };
