import { Router } from 'express';
import { getParticipants, addParticipant } from '../controllers/participantController';

const participantRouter = Router();

participantRouter.get('/participants', getParticipants);
participantRouter.post('/participants', addParticipant);

export default participantRouter;
