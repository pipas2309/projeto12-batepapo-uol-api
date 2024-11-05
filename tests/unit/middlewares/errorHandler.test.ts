import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../../src/middlewares/errorHandler';
import {
    BadRequestError, ConflictError,
    ForbiddenError,
    HttpError,
    NotFoundError,
    UnauthorizedError,
} from '../../../src/errors/HttpError';

describe('Error Handler Middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;

        next = jest.fn();
    });

    it('deve retornar o status 400 e mensagem de erro', () => {
        const error = new BadRequestError();

        errorHandler(error, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            statusCode: 400,
            message: 'Bad Request'
        });
    });

    it('deve retornar o status 401 e mensagem de erro', () => {
        const error = new UnauthorizedError();

        errorHandler(error, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            statusCode: 401,
            message: 'Unauthorized'
        });
    });

    it('deve retornar o status 403 e mensagem de erro', () => {
        const error = new ForbiddenError();

        errorHandler(error, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            statusCode: 403,
            message: 'Forbidden'
        });
    });

    it('deve retornar o status 404 e mensagem de erro', () => {
        const error = new NotFoundError();

        errorHandler(error, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            statusCode: 404,
            message: 'Not Found'
        });
    });

    it('deve retornar o status 409 e mensagem de erro', () => {
        const error = new ConflictError();

        errorHandler(error, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            statusCode: 409,
            message: 'ConflictError'
        });
    });

    it('deve retornar erro genérico para erros não-HtttpError', () => {
        const error = new HttpError(500, 'Erro desconhecido');

        errorHandler(error, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            statusCode: 500,
            message: 'Erro desconhecido'
        });
    });
});
