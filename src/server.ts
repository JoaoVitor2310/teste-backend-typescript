import express from "express";
import bodyParser from 'body-parser';
import sequelize from './config/database';
import router from './routes';
import path from 'path';

const server = express();

server.use(bodyParser.json({ limit: '10mb' }));
server.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));

server.use(express.json());

server.use('/', router);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    server.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

export { server };