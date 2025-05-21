import sequelize from '../config/database';

import User from './User';
import Service from './Service';
import Category from './Categories';
import Appointment from './Appointment';
import Review from './Review';
import DoctorProfile from './DoctorProfile'
import ServiceDoctor from './ServiceDoctor';

// Асоціації
User.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });
User.hasMany(Appointment, { foreignKey: 'doctorId', as: 'appointmentsAsDoctor' });

Appointment.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
Appointment.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId' });

Appointment.hasOne(Review, { foreignKey: 'appointmentId', as: 'review' });
Review.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

Review.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(Review, { foreignKey: 'userId' });

Service.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Service, { foreignKey: 'categoryId', as: 'services' });


User.hasOne(DoctorProfile, { foreignKey: 'userId', as: 'profile' });
DoctorProfile.belongsTo(User, { foreignKey: 'userId' });


Service.belongsToMany(User, {
  through: ServiceDoctor,
  foreignKey: 'serviceId',
  otherKey: 'doctorId',
  as: 'doctors',
});

User.belongsToMany(Service, {
  through: ServiceDoctor,
  foreignKey: 'doctorId',
  otherKey: 'serviceId',
  as: 'services',
});

export {
  sequelize,
  User,
  Service,
  Category,
  Appointment,
  Review,
  DoctorProfile,
  ServiceDoctor,
};
