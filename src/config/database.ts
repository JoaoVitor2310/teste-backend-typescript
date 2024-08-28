import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('../.env') });

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || '',
  process.env.DB_USER || '',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: true,
  }
);

export default sequelize;
