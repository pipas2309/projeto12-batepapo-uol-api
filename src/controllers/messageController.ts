import { Request, Response, NextFunction } from 'express';
import { messageSchema } from '../utils/validationSchemas';
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../errors/HttpError';
import { Message, MessageBase, MessageModel } from '../models/messageModel';
import { ParticipantModel } from '../models/participantModel';
import { getCurrentTime } from '../utils/timeUtils';

export async function getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = req.headers.user as string;
    const limit = parseInt(req.query.limit as string) || 0;

    try {
        const allMessages = await MessageModel.findAll();

        const filteredMessages = allMessages.filter((message: Message) => {
            const isPrivate = message.type === 'private_message';
            const isUserInvolved = message.from === user || message.to === user || message.to === 'Todos';

            return !isPrivate || isUserInvolved;
        });

        const messagesList = limit > 0 ? filteredMessages.slice(-limit) : filteredMessages;

        res.send(messagesList);
    } catch (error) {
        next(error);
    }
}

export async function addMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = req.headers.user as string;
    const { to, text, type }: { to: string; text: string; type: string } = req.body;

    const message: MessageBase = {
        from: user,
        to,
        text,
        type,
    };

    const validation = messageSchema.validate(message, { abortEarly: false });
    if (validation.error) {
        return next(new BadRequestError('Formato inválido'));
    }

    try {
        const isTheUserLogged = await ParticipantModel.findByName(user);

        if (!isTheUserLogged) {
            return next(new ForbiddenError('Usuário não logado'));
        }

        const newMessage: Message = {
            ...message,
            time: getCurrentTime(),
        };

        await MessageModel.create(newMessage);

        res.sendStatus(201);
    } catch (error) {
        next(error);
    }
}

export async function updateMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = req.headers.user as string;
    const { id } = req.params;
    const { to, text, type } = req.body;

    const message: MessageBase = {
        from: user,
        to,
        text,
        type,
    };

    const validation = messageSchema.validate(message, { abortEarly: false });
    if (validation.error) {
        return next(new BadRequestError('Formato inválido'));
    }

    try {
        const messageToEdit = await MessageModel.findById(id);

        if (!messageToEdit) {
            return next(new NotFoundError('Mensagem não encontrada!'));
        }

        if (messageToEdit.from !== user) {
            return next(new UnauthorizedError('Sem permissão de edição!'));
        }

        await MessageModel.update(id, message.text);

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

export async function deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = req.headers.user as string;
    const { id } = req.params;

    try {
        const message = await MessageModel.findById(id);

        if (!message) {
            return next(new NotFoundError('Mensagem não encontrada!'));
        }

        if (message.from !== user) {
            return next(new UnauthorizedError('Sem permissão de edição!'));
        }

        await MessageModel.deleteById(id);

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}
