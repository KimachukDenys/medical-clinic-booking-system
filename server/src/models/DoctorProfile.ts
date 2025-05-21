import {
  DataTypes,
  Model,
  Optional,
  Association,
} from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Review from './Review';
import Appointment from './Appointment';


interface DoctorProfileAttrs {
  id: number;
  userId: number;
  education: string | null;
  experience: string | null;
  bio: string | null;
  specialization: string;
  price: number;
  rating?: number | null;      // віртуальне
}

type DoctorProfileCreationAttrs = Optional<
  DoctorProfileAttrs,
  'id' | 'rating' | 'specialization' | 'price'
>;

class DoctorProfile
  extends Model<DoctorProfileAttrs, DoctorProfileCreationAttrs>
  implements DoctorProfileAttrs
{
  declare id: number;
  declare userId: number;
  declare education: string | null;
  declare experience: string | null;
  declare bio: string | null;
  declare specialization: string;
  declare price: number;
  declare rating: number | null;

  // метод, щоб TS знав
  declare calculateRating: () => Promise<number | null>;

  /* асоціації для TS (не обов’язково, але корисно) */
  declare static associations: {
    user: Association<DoctorProfile, User>;
    reviews: Association<DoctorProfile, Review>;
  };
}

DoctorProfile.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: User, key: 'id' },
    },
    education: { type: DataTypes.TEXT, allowNull: true },
    experience: { type: DataTypes.TEXT, allowNull: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Лікар',
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    rating: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue('rating') ?? null;
      },
    },
  },
  {
    sequelize,
    modelName: 'DoctorProfile',
    tableName: 'doctor_profiles',
    timestamps: true,
    defaultScope: {
      attributes: { include: ['rating'] },
    },
  }
);

DoctorProfile.prototype.calculateRating = async function () {
  const reviews = await Review.findAll({
    include: [
      {
        model: Appointment,
        as: 'appointment',
        attributes: [],
        where: { doctorId: this.userId },
      },
    ],
  });

  if (reviews.length === 0) return null;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
};


DoctorProfile.afterFind(
  async (
    result: DoctorProfile | readonly DoctorProfile[] | null
  ): Promise<void> => {
    const profiles: DoctorProfile[] = result
      ? Array.isArray(result)
        ? Array.from(result) // робимо мутабельний масив
        : [result]
      : [];

    for (const profile of profiles) {
      const avg = await profile.calculateRating();
      profile.setDataValue('rating', avg);
    }
  }
);

export default DoctorProfile;
