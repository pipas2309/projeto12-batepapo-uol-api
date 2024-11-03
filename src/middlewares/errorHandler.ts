import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/HttpError';

/* eslint-disable @typescript-eslint/no-unused-vars */
export function errorHandler(err: HttpError, _req: Request, res: Response, _next: NextFunction): void {
    console.error(`Erro ${err.statusCode}: ${err.message}`);
    res.status(err.statusCode).json({
        status: 'error',
        statusCode: err.statusCode,
        message: err.message,
    });
}
