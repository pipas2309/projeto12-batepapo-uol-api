import { Request, Response } from 'express';
import { HttpError } from '../errors/HttpError';

export function errorHandler(err: HttpError, _req: Request, res: Response): void {
    console.error('Erro:', err);

    if (err instanceof HttpError) {
        res.status(err.statusCode).send({ error: err.message });
    } else {
        res.status(500).send({ error: 'Internal Server Error' });
    }
}
