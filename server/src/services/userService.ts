import { injectable, inject } from 'tsyringe';
import { Op } from 'sequelize';
import type { Gender } from '../models/User';

@injectable()
export class UserService {
  constructor(
    @inject('Bcrypt')     private bcrypt: typeof import('bcrypt'),
    @inject('Jwt')        private jwt: typeof import('jsonwebtoken'),
    @inject('JwtSecret')  private jwtSecret: string,
    @inject('UserModel')  private UserModel: typeof import('../models/User').default,
  ) {}

  /* ---------- register ---------- */
  async registerUser(data: {
    firstName: string; lastName: string; email: string;
    phone: string; password: string; gender: Gender;
  }) {
    const { firstName, lastName, email, phone, password, gender } = data;

    if (!firstName || !lastName || !email || !phone || !password || !gender) {
      throw new Error('ValidationError: All fields are required');
    }
    if (!['male', 'female'].includes(gender)) {
      throw new Error('ValidationError: Invalid gender value');
    }

    const existingUser = await this.UserModel.findOne({
      where: { [Op.or]: [{ email }, { phone }] },
    });
    if (existingUser) {
      throw new Error('ConflictError: User with this email or phone already exists');
    }

    const hashedPassword = await this.bcrypt.hash(password, 10);

    const newUser = await this.UserModel.create({
      firstName, lastName, email, phone, gender,
      password: hashedPassword, role: 'patient',
    });

    return {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
      gender: newUser.gender,
      role: newUser.role,
    };
  }

  /* ---------- login ---------- */
  async loginUser(email: string, password: string) {
    const user = await this.UserModel.findOne({ where: { email } });
    if (!user) throw new Error('AuthError: Invalid email or password');

    const isMatch = await this.bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('AuthError: Invalid email or password');

    const token = this.jwt.sign(
      { id: user.id, role: user.role, firstName: user.firstName, lastName: user.lastName },
      this.jwtSecret,
      { expiresIn: '1d' },
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  /* ---------- get profile ---------- */
  async getUserProfile(id: number) {
    if (Number.isNaN(id)) throw new Error('ValidationError: Invalid userId parameter');

    const user = await this.UserModel.findOne({
      where: { id },
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'photoUrl'],
    });
    if (!user) throw new Error('NotFoundError: User not found');

    return user;
  }

  /* ---------- edit profile ---------- */
  async editUserProfile(
    userId: number,
    data: { firstName?: string; lastName?: string; phone?: string; photoFileName?: string },
  ) {
    const user = await this.UserModel.findByPk(userId);
    if (!user) throw new Error('NotFoundError: User not found');

    const { firstName, lastName, phone, photoFileName } = data;

    /* перевірка унікальності телефону */
    if (phone) {
      const exists = await this.UserModel.findOne({
        where: { phone, id: { [Op.ne]: userId } },
      });
      if (exists) throw new Error('ConflictError: Phone already in use by another user');
    }

    const photoUrl = photoFileName ? `images/${photoFileName}` : undefined;

    await user.update({
      firstName: firstName ?? user.firstName,
      lastName:  lastName  ?? user.lastName,
      phone:     phone     ?? user.phone,
      photoUrl:  photoUrl  ?? user.photoUrl,
    });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      photoUrl: user.photoUrl,
    };
  }
}
