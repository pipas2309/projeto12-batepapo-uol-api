import { Request, Response, NextFunction } from 'express';
import { addParticipant, getParticipants } from '../../../src/controllers/participantController';
import { ParticipantModel } from '../../../src/models/participantModel';
import { BadRequestError, ConflictError } from '../../../src/errors/HttpError';
import { MessageModel } from '../../../src/models/messageModel';

jest.mock('../../../src/models/participantModel');
jest.mock('../../../src/models/messageModel');

describe('Participant Controller - addParticipant', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { body: { name: 'TestUser' } };
        res = {
            sendStatus: jest.fn() as jest.Mock,
            send: jest.fn() as jest.Mock
        };
        next = jest.fn();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('deve adicionar um novo participante', async () => {
        (ParticipantModel.findByName as jest.Mock).mockResolvedValue(null);
        (ParticipantModel.create as jest.Mock).mockResolvedValue(undefined);
        (MessageModel.create as jest.Mock).mockResolvedValue(undefined);

        await addParticipant(req as Request, res as Response, next);

        expect(ParticipantModel.findByName).toHaveBeenCalledWith('TestUser');
        expect(ParticipantModel.create).toHaveBeenCalledWith({ name: 'TestUser', lastStatus: expect.any(Number) });
        expect(res.sendStatus).toHaveBeenCalledWith(201);
    });

    it('deve retornar uma lista de participantes', async () => {
        (ParticipantModel.findAll as jest.Mock).mockResolvedValue([{ name: 'TestUser' }, { name: 'User2' }]);

        await getParticipants({} as Request, res as Response, next);

        expect(ParticipantModel.findAll).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith([{ name: 'TestUser' }, { name: 'User2' }]);
    });

    it('deve retornar erro se o participante já existe', async () => {
        (ParticipantModel.findByName as jest.Mock).mockResolvedValue({ name: 'TestUser' });

        await addParticipant(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(ConflictError));
    });

    it('deve tentar adicionar um novo participante com payload errado', async () => {
        const wrongReq = { body: { names: 'TestUser' } };
        await addParticipant(wrongReq as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it('deve tentar adicionar um novo participante com banco desligado', async () => {
        (ParticipantModel.findByName as jest.Mock).mockResolvedValue(null);
        (ParticipantModel.create as jest.Mock).mockRejectedValue(new Error('Database is down'));

        await addParticipant(req as Request, res as Response, next);

        expect(res.sendStatus).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(Error('Database is down'));
    });

    it('deve tentar buscar os participantes com o banco desligado', async () => {
        (ParticipantModel.findAll as jest.Mock).mockRejectedValue(new Error('Database is down'));

        await getParticipants({} as Request, res as Response, next);

        expect(res.send).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(Error('Database is down'));
    });
});
