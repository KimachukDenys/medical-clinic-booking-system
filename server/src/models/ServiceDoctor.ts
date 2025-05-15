import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Service from './Service';
import User from './User';

class ServiceDoctor extends Model {
  public serviceId!: number;
  public doctorId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ServiceDoctor.init(
  {
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Service,
        key: 'id',
      },
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'ServiceDoctor',
    tableName: 'service_doctors',
    timestamps: true,
  }
);

export default ServiceDoctor;
