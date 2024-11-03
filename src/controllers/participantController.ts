import { Request, Response, NextFunction } from 'express';
import { participantSchema } from '../utils/validationSchemas';
import { BadRequestError, ConflictError } from '../errors/HttpError';
import { getCurrentTime } from '../utils/timeUtils';
import { Participant, ParticipantModel } from '../models/participantModel';
import { Message, MessageModel } from '../models/messageModel';

export async function getParticipants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const allParticipants = await ParticipantModel.findAll();
        res.send(allParticipants);
    } catch (error) {
        next(error);
    }
}

export async function addParticipant(req: Request, res: Response, next: NextFunction): Promise<void> {
    const validation = participantSchema.validate(await req.body, { abortEarly: false });

    if (validation.error) {
        return next(new BadRequestError('Dados inválidos'));
    }

    const name: string = req.body.name;

    try {
        const alreadyLogged = await ParticipantModel.findByName(name);

        if (alreadyLogged) {
            return next(new ConflictError('Nome de usuário já está em uso!'));
        }

        const newParticipant: Participant = {
            name,
            lastStatus: Date.now(),
        };

        const alertMessageNewParticipant: Message = {
            from: name,
            to: 'Todos',
            text: 'entra na sala...',
            type: 'status',
            time: getCurrentTime(),
        };

        await ParticipantModel.create(newParticipant);
        await MessageModel.create(alertMessageNewParticipant);

        res.sendStatus(201);
    } catch (error) {
        next(error);
    }
}
