import { Request, Response } from 'express';
import { HttpError } from '../errors/HttpError';

export function errorHandler(err: HttpError, _req: Request, res: Response): void {
    console.error('Erro:', err);

    res.status(err.statusCode).send({ error: err.message });
}
