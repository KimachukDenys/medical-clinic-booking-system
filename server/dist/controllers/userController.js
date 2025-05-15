"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const registerUser = async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;
    try {
        // Перевірка, чи вже існує користувач з таким email або телефонним номером
        const existingUser = await User_1.default.findOne({
            where: {
                [sequelize_1.Op.or]: [{ email }, { phone }],
            },
        });
        if (existingUser) {
            res.status(400).json({ message: 'User with this email or phone already exists' });
            return;
        }
        if (!firstName || !lastName || !email || !phone || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters long' });
            return;
        }
        // Перевірка на формат email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: 'Invalid email format' });
            return;
        }
        // Перевірка на формат телефонного номера (можна налаштувати під свої вимоги)
        const phoneRegex = /^\+?\d{10,15}$/; // Приклад: +380123456789
        if (!phoneRegex.test(phone)) {
            res.status(400).json({ message: 'Invalid phone number format' });
            return;
        }
        // Хешування пароля
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Створення нового користувача
        const newUser = await User_1.default.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            role: 'patient', // за замовчуванням роль 'patient'
        });
        // Відправка відповіді з даними користувача (без пароля)
        res.status(201).json({
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ where: { email } });
        if (!user) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.loginUser = loginUser;
