import { Router, Request, Response } from 'express';
import ClientController from '../controllers/ClientController';

// New Router instance
const router = Router();

const clientRouter = Router();

// Instancie o controlador
const clientController = new ClientController();

// Defina as rotas e conecte ao controlador
clientRouter.get('/:customer_code/list', clientController.list);

export default clientRouter;