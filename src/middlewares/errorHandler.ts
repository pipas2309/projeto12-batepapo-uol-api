import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/HttpError';
import { logger } from '@infra/config/logger';

/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Middleware de gerenciamento de erros.
 * @param err - O objeto HttpError.
 * @param _req - Objeto express de requisição (não usado).
 * @param res - Objeto express de resposta.
 * @param _next - Próxima função express (não usado diretamente).
 */
export function errorHandler(err: HttpError, _req: Request, res: Response, _next: NextFunction): void {
    logger.error(`Erro ${err.statusCode}: ${err.message}`, { stack: err.stack });

    res.status(err.statusCode).json({
        status: 'error',
        statusCode: err.statusCode,
        message: err.message,
    });
}
