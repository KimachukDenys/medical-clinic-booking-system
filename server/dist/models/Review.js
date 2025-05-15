"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Review extends sequelize_1.Model {
}
Review.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    appointmentId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'appointments', key: 'id' }
    },
    rating: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
    },
    comment: {
        type: sequelize_1.DataTypes.TEXT,
    }
}, {
    sequelize: database_1.default,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true,
});
exports.default = Review;
