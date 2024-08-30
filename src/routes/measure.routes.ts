import { Router } from 'express';
import MeasureController from '../controllers/MeasureController';


const router = Router();

const measureRouter = Router();


const measureController = new MeasureController();


measureRouter.post('/upload', measureController.upload);
measureRouter.patch('/confirm', measureController.confirm);
measureRouter.get('/:customer_code/list', measureController.list);

export default measureRouter;