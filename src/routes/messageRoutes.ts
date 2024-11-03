import { Router } from 'express';
import { getMessages, addMessage, updateMessage, deleteMessage } from '../controllers/messageController';

const messageRouter = Router();

messageRouter.get('/messages', getMessages);
messageRouter.post('/messages', addMessage);
messageRouter.put('/messages/:id', updateMessage);
messageRouter.delete('/messages/:id', deleteMessage);

export default messageRouter;
