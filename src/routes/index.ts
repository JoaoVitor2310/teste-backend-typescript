import { Router } from 'express';
import measureRouter from './measure.routes';
import clientRouter from './client.routes';

// Create a new Router instance
const router = Router();

// Mount the routers
router.use('/', measureRouter);
router.use('/users', clientRouter);

export default router;