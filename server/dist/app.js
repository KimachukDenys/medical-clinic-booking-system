"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes")); // Імпортуємо роутер
const protectedRoutes_1 = __importDefault(require("./routes/protectedRoutes"));
const app = (0, express_1.default)();
// Мідлвари
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use('/api/protected', protectedRoutes_1.default);
// Роутер
app.use('/api/users', userRoutes_1.default); // Тут використовуємо роутер для маршруту '/api/users'
// 404
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});
exports.default = app;
