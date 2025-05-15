import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Category extends Model {}

Category.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Category',
  tableName: 'categories',
  timestamps: false, // Якщо не потрібно додавати timestamps
});

export default Category;
