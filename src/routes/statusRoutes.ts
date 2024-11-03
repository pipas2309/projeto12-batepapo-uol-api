import { Router } from 'express';
import { updateStatus } from '../controllers/statusController';

const statusRouter = Router();

statusRouter.post('/status', updateStatus);

export default statusRouter;
