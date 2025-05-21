import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/database';

class Appointment extends Model<InferAttributes<Appointment>, InferCreationAttributes<Appointment>> {
  declare id: CreationOptional<number>;
  declare patientId: number;
  declare doctorId: number;
  declare serviceId: number;
  declare date: Date;
  declare status: 'pending' | 'confirmed' | 'finished' | 'cancelled';
}

Appointment.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'services', key: 'id' }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'finished','cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  }
}, {
  sequelize,
  modelName: 'Appointment',
  tableName: 'appointments',
  timestamps: true,
});

export default Appointment;
