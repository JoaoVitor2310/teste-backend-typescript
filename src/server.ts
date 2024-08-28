import express from "express";
import sequelize from './config/database';

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send('Hello Worldee!');
})

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