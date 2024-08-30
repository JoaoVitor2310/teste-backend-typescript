import { Router } from 'express';
import measureRouter from './measure.routes';


const router = Router();


router.use('/', measureRouter);

export default router;