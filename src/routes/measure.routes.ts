import { Router, Request, Response } from 'express';
import MeasureController from '../controllers/MeasureController';

// New Router instance
const router = Router();

const measureRouter = Router();

// Instancie o controlador
const measureController = new MeasureController();

// Defina as rotas e conecte ao controlador
measureRouter.post('/upload', measureController.upload);
measureRouter.patch('/confirm', measureController.confirm);

export default measureRouter;