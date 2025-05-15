import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class DoctorProfile extends Model {
  public id!: number;
  public userId!: number;
  public education!: string;
  public experience!: string;
  public bio!: string;
}

DoctorProfile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    education: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    experience: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'DoctorProfile',
    tableName: 'doctor_profiles',
    timestamps: true,
  }
);

export default DoctorProfile;
