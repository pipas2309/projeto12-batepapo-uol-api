import { Request, Response, NextFunction } from 'express';
import { ParticipantModel } from '../models/participantModel';
import { NotFoundError } from '../errors/HttpError';

export async function updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = req.headers.user as string;

    try {
        const isLogged = await ParticipantModel.findByName(user);

        if (!isLogged) {
            return next(new NotFoundError());
        }

        await ParticipantModel.updateLastStatus(user, Date.now());

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}