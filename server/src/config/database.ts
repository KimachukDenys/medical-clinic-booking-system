import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('clinic_db', 'admin_k', '123456', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, // Вимкнути SQL-логи (можна ввімкнути при потребі)
});

export default sequelize;
