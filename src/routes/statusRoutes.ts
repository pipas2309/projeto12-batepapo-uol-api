import { Router } from 'express';
import { updateStatus } from '../controllers/statusController';

const statusRouter = Router();

/** Rotas relacionadas com configurações de funcionamento do serviço. */
statusRouter.post('/status', updateStatus);

export default statusRouter;
