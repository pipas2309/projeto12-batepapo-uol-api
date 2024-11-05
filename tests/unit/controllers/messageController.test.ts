import { Request, Response, NextFunction } from 'express';
import { getMessages, addMessage, updateMessage, deleteMessage } from '../../../src/controllers/messageController';
import { MessageModel } from '../../../src/models/messageModel';
import { ParticipantModel } from '../../../src/models/participantModel';
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../../../src/errors/HttpError';

jest.mock('../../../src/models/messageModel');
jest.mock('../../../src/models/participantModel');

describe('Message Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            send: jest.fn() as jest.Mock,
            sendStatus: jest.fn() as jest.Mock,
            json: jest.fn() as jest.Mock,
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('GET/ deve retornar uma lista de mensagens', async () => {
        req = { headers: { user: 'TestUser' }, query: { limit: '2' } };
        const messages = [
            { from: 'User1', to: 'TestUser', text: 'Hello', type: 'message' },
            { from: 'TestUser', to: 'User2', text: 'Hi', type: 'private_message' },
        ];
        (MessageModel.findAll as jest.Mock).mockResolvedValue(messages);

        await getMessages(req as Request, res as Response, next);

        expect(MessageModel.findAll).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(messages);
    });

    it('deve retornar todas as mensagens quando o limite não é especificado', async () => {
        req = {
            headers: { user: 'TestUser' },
            query: { limit: '0' },
        };
        const messages = [
            { from: 'User1', to: 'TestUser', text: 'Hello', type: 'message' },
            { from: 'TestUser', to: 'User2', text: 'Hi', type: 'private_message' },
            { from: 'User3', to: 'TestUser', text: 'Hey', type: 'message' }
        ];
        (MessageModel.findAll as jest.Mock).mockResolvedValue(messages);

        await getMessages(req as Request, res as Response, next);

        expect(res.send).toHaveBeenCalledWith(messages);
    });

    it('deve retornar as últimas N mensagens quando o limite é especificado', async () => {
        req = {
            headers: { user: 'TestUser' },
            query: { limit: '1' }
        };
        const messages = [
            { from: 'User1', to: 'TestUser', text: 'Hello', type: 'message', time: '11:10:00' },
            { from: 'User2', to: 'User3', text: 'Hi', type: 'private_message', time: '11:30:00' },
            { from: 'User3', to: 'TestUser', text: 'Hey', type: 'message', time: '11:50:00' }
        ];
        (MessageModel.findAll as jest.Mock).mockResolvedValue(messages);

        await getMessages(req as Request, res as Response, next);

        expect(res.send).toHaveBeenCalledWith([
            { from: 'User3', to: 'TestUser', text: 'Hey', type: 'message', time: '11:50:00' }
        ]);
    });

    it('deve filtrar apenas mensagens visíveis para o usuário', async () => {
        req = {
            headers: { user: 'TestUser' },
            query: { limit: '' }
        };

        const messages = [
            { from: 'User1', to: 'TestUser', text: 'Hello', type: 'message' },
            { from: 'User2', to: 'User3', text: 'Hi', type: 'private_message' },
            { from: 'User3', to: 'TestUser', text: 'Hey', type: 'private_message' }
        ];
        (MessageModel.findAll as jest.Mock).mockResolvedValue(messages);

        await getMessages(req as Request, res as Response, next);

        expect(res.send).toHaveBeenCalledWith([
            { from: 'User1', to: 'TestUser', text: 'Hello', type: 'message' },
            { from: 'User3', to: 'TestUser', text: 'Hey', type: 'private_message' }
        ]);
    });

    it('GET/ deve retornar erro ao tentar buscar mensagens com banco desligado', async () => {
        req = { headers: { user: 'TestUser' }, query: { limit: '2' } };
        (MessageModel.findAll as jest.Mock).mockRejectedValue(new Error('Database is down'));

        await getMessages(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(new Error('Database is down'));
    });

    it('POST/ deve adicionar uma nova mensagem', async () => {
        req = {
            headers: { user: 'TestUser' },
            body: { to: 'User2', text: 'Hi', type: 'message' }
        };
        (ParticipantModel.findByName as jest.Mock).mockResolvedValue({ name: 'TestUser' });
        (MessageModel.create as jest.Mock).mockResolvedValue(undefined);

        await addMessage(req as Request, res as Response, next);

        expect(ParticipantModel.findByName).toHaveBeenCalledWith('TestUser');
        expect(MessageModel.create).toHaveBeenCalledWith({
            from: 'TestUser',
            to: 'User2',
            text: 'Hi',
            type: 'message',
            time: expect.any(String),
        });
        expect(res.sendStatus).toHaveBeenCalledWith(201);
    });

    it('POST/ deve retornar erro ao tentar adicionar uma mensagem sem estar logado', async () => {
        req = {
            headers: { user: 'UnknownUser' },
            body: { to: 'User2', text: 'Hi', type: 'message' }
        };
        (ParticipantModel.findByName as jest.Mock).mockResolvedValue(null);

        await addMessage(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it('POST/ deve retornar erro ao tentar adicionar uma mensagem com banco desligado', async () => {
        req = {
            headers: { user: 'UnknownUser' },
            body: { to: 'User2', text: 'Hi', type: 'message' }
        };
        (ParticipantModel.findByName as jest.Mock).mockRejectedValue(new Error('Database is down'));

        await addMessage(req as Request, res as Response, next);

        expect(res.sendStatus).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(Error('Database is down'));
    });

    it('POST/ deve retornar erro ao tentar adicionar uma mensagem com payload errado', async () => {
        req = {
            headers: { use: 'UnknownUser' },
            body: { para: 'User2', text: 'Hi', type: 'message' }
        };
        (ParticipantModel.findByName as jest.Mock).mockResolvedValue(null);

        await addMessage(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it('PUT/ deve atualizar uma mensagem existente', async () => {
        req = {
            headers: { user: 'TestUser' },
            params: { id: '123' },
            body: { to: 'User2', text: 'Updated text', type: 'message' }
        };
        (MessageModel.findById as jest.Mock).mockResolvedValue({ from: 'TestUser' });
        (MessageModel.update as jest.Mock).mockResolvedValue(undefined);

        await updateMessage(req as Request, res as Response, next);

        expect(MessageModel.findById).toHaveBeenCalledWith('123');
        expect(MessageModel.update).toHaveBeenCalledWith('123', 'Updated text');
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it('PUT/ deve retornar erro ao tentar atualizar uma mensagem sem permissão', async () => {
        req = {
            headers: { user: 'OtherUser' },
            params: { id: '123' },
            body: { to: 'User2', text: 'Updated text', type: 'message' }
        };
        (MessageModel.findById as jest.Mock).mockResolvedValue({ from: 'TestUser' });

        await updateMessage(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('PUT/ deve retornar erro ao tentar atualizar uma mensagem com payload errado', async () => {
        req = {
            headers: { use: 'OtherUser' },
            params: { id: '123' },
            body: { para: 'User2', text: 'Updated text', type: 'message' }
        };

        await updateMessage(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it('PUT/ deve retornar erro ao tentar atualizar uma mensagem com banco desligado', async () => {
        req = {
            headers: { user: 'TestUser' },
            params: { id: '123' },
            body: { to: 'User2', text: 'Updated text', type: 'message' }
        };
        (MessageModel.findById as jest.Mock).mockResolvedValue({ from: 'TestUser' });
        (MessageModel.update as jest.Mock).mockRejectedValue(new Error('Database is down'));

        await updateMessage(req as Request, res as Response, next);

        expect(res.sendStatus).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(Error('Database is down'));
    });

    it('PUT/ deve retornar erro ao tentar atualizar uma mensagem inexistente', async () => {
        req = {
            headers: { user: 'TestUser' },
            params: { id: '123' },
            body: { to: 'User2', text: 'Updated text', type: 'message' }
        };
        (MessageModel.findById as jest.Mock).mockResolvedValue(null);

        await updateMessage(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    });

    it('DELETE/ deve deletar uma mensagem existente', async () => {
        req = { headers: { user: 'TestUser' }, params: { id: '123' } };
        (MessageModel.findById as jest.Mock).mockResolvedValue({ from: 'TestUser' });
        (MessageModel.deleteById as jest.Mock).mockResolvedValue(undefined);

        await deleteMessage(req as Request, res as Response, next);

        expect(MessageModel.findById).toHaveBeenCalledWith('123');
        expect(MessageModel.deleteById).toHaveBeenCalledWith('123');
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it('DELETE/ deve retornar erro ao tentar deletar uma mensagem inexistente', async () => {
        req = { headers: { user: 'TestUser' }, params: { id: '123' } };
        (MessageModel.findById as jest.Mock).mockResolvedValue(null);

        await deleteMessage(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    });

    it('DELETE/ deve retornar erro ao tentar deletar uma mensagem sem permissão', async () => {
        req = { headers: { user: 'OtherUser' }, params: { id: '123' } };
        (MessageModel.findById as jest.Mock).mockResolvedValue({ from: 'TestUser' });

        await deleteMessage(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('DELETE/ deve retornar erro ao tentar deletar uma mensagem com banco desligado', async () => {
        req = { headers: { user: 'OtherUser' }, params: { id: '123' } };
        (MessageModel.findById as jest.Mock).mockRejectedValue(new Error('Database is down'));

        await deleteMessage(req as Request, res as Response, next);

        expect(res.sendStatus).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(Error('Database is down'));
    });
});
