import { Router } from 'express';
import participantRouter from './participantRoutes';
import messageRouter from './messageRoutes';
import statusRouter from './statusRoutes';

const router = Router();

router.use(participantRouter);
router.use(messageRouter);
router.use(statusRouter);

export default router;
