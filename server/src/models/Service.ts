import { DataTypes, Model, Optional, 
  BelongsToManyAddAssociationMixin, 
  BelongsToManyRemoveAssociationMixin, 
  BelongsToManyGetAssociationsMixin
} from 'sequelize';
import sequelize from '../config/database';
import Category from './Categories';
import User from './User';
import ServiceDoctor from './ServiceDoctor';  // Модель для зв'язку

interface ServiceAttributes {
  id: number;
  title: string;
  description: string;
  price: number;
  imagePath?: string | null;
  isHidden: boolean;
  categoryId?: number | null;
}

interface ServiceCreationAttributes extends Optional<ServiceAttributes, 'id'> {}

class Service extends Model<ServiceAttributes, ServiceCreationAttributes> implements ServiceAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public price!: number;
  public imagePath!: string | null;
  public isHidden!: boolean;
  public categoryId!: number | null;
  public doctors?: User[]; 
  
  // Додаємо асоціації для лікарів
  public addDoctor!: BelongsToManyAddAssociationMixin<User, number>;
  public removeDoctor!: BelongsToManyRemoveAssociationMixin<User, number>;
  public getDoctors!: BelongsToManyGetAssociationsMixin<User>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Service.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isHidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Category,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Service',
    tableName: 'services',
    timestamps: true,
  }
);


export default Service;
