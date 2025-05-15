"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/models/Appointment.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Appointment extends sequelize_1.Model {
}
Appointment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    patientId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    doctorId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    serviceId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'services', key: 'id' }
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending',
    }
}, {
    sequelize: database_1.default,
    modelName: 'Appointment',
    tableName: 'appointments',
    timestamps: true,
});
exports.default = Appointment;
