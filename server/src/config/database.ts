import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('clinic_db', 'admin_k', '123456', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

export default sequelize;
