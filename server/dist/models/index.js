"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.Review = exports.Appointment = exports.Service = exports.User = exports.sequelize = void 0;
// src/models/index.ts
const database_1 = __importDefault(require("../config/database"));
exports.sequelize = database_1.default;
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const Service_1 = __importDefault(require("./Service"));
exports.Service = Service_1.default;
const Appointment_1 = __importDefault(require("./Appointment"));
exports.Appointment = Appointment_1.default;
const Review_1 = __importDefault(require("./Review"));
exports.Review = Review_1.default;
const Message_1 = __importDefault(require("./Message"));
exports.Message = Message_1.default;
// Associations
User_1.default.hasMany(Appointment_1.default, { foreignKey: 'patientId', as: 'appointments' });
User_1.default.hasMany(Appointment_1.default, { foreignKey: 'doctorId', as: 'appointmentsAsDoctor' });
User_1.default.hasMany(Message_1.default, { foreignKey: 'senderId', as: 'sentMessages' });
User_1.default.hasMany(Message_1.default, { foreignKey: 'receiverId', as: 'receivedMessages' });
Appointment_1.default.belongsTo(User_1.default, { foreignKey: 'patientId', as: 'patient' });
Appointment_1.default.belongsTo(User_1.default, { foreignKey: 'doctorId', as: 'doctor' });
Appointment_1.default.belongsTo(Service_1.default, { foreignKey: 'serviceId' });
Appointment_1.default.hasOne(Review_1.default, { foreignKey: 'appointmentId' });
Review_1.default.belongsTo(Appointment_1.default, { foreignKey: 'appointmentId' });
