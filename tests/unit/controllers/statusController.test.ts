import { Request, Response, NextFunction } from 'express';
import { updateStatus } from '../../../src/controllers/statusController';
import { ParticipantModel } from '../../../src/models/participantModel';
import { NotFoundError } from '../../../src/errors/HttpError';

jest.mock('../../../src/models/participantModel');

describe('Status Controller - updateStatus', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            headers: { user: 'TestUser' }
        };

        res = {
            sendStatus: jest.fn() as jest.Mock
        };

        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve atualizar o status de um participante', async () => {
        (ParticipantModel.findByName as jest.Mock).mockResolvedValue({ name: 'TestUser' });
        (ParticipantModel.updateLastStatus as jest.Mock).mockResolvedValue(undefined);

        await updateStatus(req as Request, res as Response, next);

        expect(ParticipantModel.findByName).toHaveBeenCalledWith('TestUser');
        expect(ParticipantModel.updateLastStatus).toHaveBeenCalledWith('TestUser', expect.any(Number));
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it('deve retornar erro de não autorizado se o participante não for encontrado', async () => {
        (ParticipantModel.findByName as jest.Mock).mockResolvedValue(null);

        await updateStatus(req as Request, res as Response, next);

        expect(ParticipantModel.findByName).toHaveBeenCalledWith('TestUser');
        expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
        expect(res.sendStatus).not.toHaveBeenCalled();
    });

    it('deve retornar erro se o banco de dados estiver desligado', async () => {
        (ParticipantModel.findByName as jest.Mock).mockRejectedValue(new Error('Database is down'));

        await updateStatus(req as Request, res as Response, next);

        expect(ParticipantModel.findByName).toHaveBeenCalledWith('TestUser');
        expect(next).toHaveBeenCalledWith(new Error('Database is down'));
        expect(res.sendStatus).not.toHaveBeenCalled();
    });
});
