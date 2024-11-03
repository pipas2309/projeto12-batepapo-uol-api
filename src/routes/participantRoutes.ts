import { Router } from 'express';
import { getParticipants, addParticipant } from '../controllers/participantController';

const participantRouter = Router();

/** Rotas relacionadas com os participantes. */
participantRouter.get('/participants', getParticipants);
participantRouter.post('/participants', addParticipant);

export default participantRouter;
