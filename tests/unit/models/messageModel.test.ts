import { MessageModel } from '../../../src/models/messageModel';
import { database } from '../../../src/config/database';
import { ObjectId } from 'mongodb';

jest.mock('../../../src/config/database', () => ({
    database: { mongo: {
            collection: jest.fn().mockReturnThis(),
            findOne: jest.fn(),
            insertOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            find: jest.fn().mockReturnThis(),
            toArray: jest.fn()
        }
    }
}));

describe('MessageModel', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve encontrar uma mensagem pelo ID', async () => {
        const message = { _id: new ObjectId(), from: 'User1', to: 'User2', text: 'Hello', type: 'message', time: '12:00:00' };
        (database.mongo!.collection('mensagens').findOne as jest.Mock).mockResolvedValue(message);

        const result = await MessageModel.findById(message._id.toString());

        expect(database.mongo!.collection).toHaveBeenCalledWith('mensagens');
        expect(database.mongo!.collection('mensagens').findOne).toHaveBeenCalledWith({ _id: new ObjectId(message._id) });
        expect(result).toEqual(message);
    });

    it('deve criar uma nova mensagem', async () => {
        const message = { from: 'User1', to: 'User2', text: 'Hello', type: 'message', time: '12:00:00' };
        (database.mongo!.collection('mensagens').insertOne as jest.Mock).mockResolvedValue({ insertedId: new ObjectId() });

        await MessageModel.create(message);

        expect(database.mongo!.collection).toHaveBeenCalledWith('mensagens');
        expect(database.mongo!.collection('mensagens').insertOne).toHaveBeenCalledWith(message);
    });

    it('deve atualizar uma mensagem pelo ID', async () => {
        const messageId = new ObjectId();
        const newText = 'Updated text';
        (database.mongo!.collection('mensagens').updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 });

        await MessageModel.update(messageId.toString(), newText);

        expect(database.mongo!.collection).toHaveBeenCalledWith('mensagens');
        expect(database.mongo!.collection('mensagens').updateOne).toHaveBeenCalledWith(
            { _id: messageId },
            { $set: { text: newText, time: expect.any(String) } }
        );
    });

    it('deve deletar uma mensagem pelo ID', async () => {
        const messageId = new ObjectId();
        (database.mongo!.collection('mensagens').deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

        await MessageModel.deleteById(messageId.toString());

        expect(database.mongo!.collection).toHaveBeenCalledWith('mensagens');
        expect(database.mongo!.collection('mensagens').deleteOne).toHaveBeenCalledWith({ _id: messageId });
    });

    it('deve encontrar todas as mensagens', async () => {
        const messages = [{ from: 'User1', to: 'User2', text: 'Hello', type: 'message', time: '12:00:00' }];
        (database.mongo!.collection('mensagens').find().toArray as jest.Mock).mockResolvedValue(messages);

        const result = await MessageModel.findAll();

        expect(database.mongo!.collection).toHaveBeenCalledWith('mensagens');
        expect(database.mongo!.collection('mensagens').find().toArray).toHaveBeenCalled();
        expect(result).toEqual(messages);
    });
});
