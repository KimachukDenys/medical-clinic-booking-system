"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('clinic_db', 'admin_k', '123456', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false, // Вимкнути SQL-логи (можна ввімкнути при потребі)
});
exports.default = sequelize;
