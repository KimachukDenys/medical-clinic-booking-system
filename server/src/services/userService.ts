import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, {Gender} from '../models/User';
import { Op } from 'sequelize';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export class UserService {
  async registerUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    gender: Gender; 
  }) {
    const { firstName, lastName, email, phone, password, gender } = data;

    if (!firstName || !lastName || !email || !phone || !password || !gender) {
      throw new Error('ValidationError: All fields are required');
    }

    if (!['male', 'female'].includes(gender)) {
      throw new Error('ValidationError: Invalid gender value');
    }

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { phone }] },
    });

    if (existingUser) {
      throw new Error('ConflictError: User with this email or phone already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      gender,
      password: hashedPassword,
      role: 'patient',
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

  async loginUser(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('AuthError: Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('AuthError: Invalid email or password');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, firstName: user.firstName, lastName: user.lastName },
      JWT_SECRET,
      { expiresIn: '1d' }
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

  async getUserProfile(id: number) {
    if (isNaN(id)) {
      throw new Error('ValidationError: Invalid userId parameter');
    }

    const user = await User.findOne({
      where: { id },
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'photoUrl'],
    });

    if (!user) {
      throw new Error('NotFoundError: User not found');
    }

    return user;
  }

  async editUserProfile(userId: number, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    photoFileName?: string; // <- назва файлу після завантаження через multer
  }) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('NotFoundError: User not found');
    }

    const { firstName, lastName, phone, photoFileName } = data;

    // Перевірка, чи email або phone вже використовуються іншим користувачем
    const conditions: any[] = [];
    if (phone) conditions.push({ phone });

    if (conditions.length > 0) {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: conditions,
          id: { [Op.ne]: userId },
        },
      });

      if (existingUser) {
        throw new Error('ConflictError: Email or phone already in use by another user');
      }
    }

    // Формуємо шлях до фото, якщо файл було завантажено
    const photoUrl = photoFileName ? `images/${photoFileName}` : undefined;

    // Оновлення
    await user.update({
      firstName: firstName ?? user.firstName,
      lastName: lastName ?? user.lastName,
      phone: phone ?? user.phone,
      photoUrl: photoUrl ?? user.photoUrl,
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
