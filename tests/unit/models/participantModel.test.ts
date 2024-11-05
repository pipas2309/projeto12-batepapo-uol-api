import { ParticipantModel } from '../../../src/models/participantModel';
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

describe('ParticipantModel', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve encontrar um participante pelo nome', async () => {
        const participant = { name: 'TestUser', lastStatus: Date.now() };
        (database.mongo!.collection('participantes').findOne as jest.Mock).mockResolvedValue(participant);

        const result = await ParticipantModel.findByName('TestUser');

        expect(database.mongo!.collection).toHaveBeenCalledWith('participantes');
        expect(database.mongo!.collection('participantes').findOne).toHaveBeenCalledWith({ name: 'TestUser' });
        expect(result).toEqual(participant);
    });

    it('deve criar um novo participante', async () => {
        const participant = { name: 'TestUser', lastStatus: Date.now() };
        (database.mongo!.collection('participantes').insertOne as jest.Mock).mockResolvedValue({ insertedId: new ObjectId() });

        await ParticipantModel.create(participant);

        expect(database.mongo!.collection).toHaveBeenCalledWith('participantes');
        expect(database.mongo!.collection('participantes').insertOne).toHaveBeenCalledWith(participant);
    });

    it('deve atualizar o status de um participante', async () => {
        const lastStatus = Date.now();
        (database.mongo!.collection('participantes').updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 });

        await ParticipantModel.updateLastStatus('TestUser', lastStatus);

        expect(database.mongo!.collection).toHaveBeenCalledWith('participantes');
        expect(database.mongo!.collection('participantes').updateOne).toHaveBeenCalledWith(
            { name: 'TestUser' },
            { $set: { lastStatus } }
        );
    });

    it('deve deletar um participante pelo nome', async () => {
        (database.mongo!.collection('participantes').deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

        await ParticipantModel.deleteByName('TestUser');

        expect(database.mongo!.collection).toHaveBeenCalledWith('participantes');
        expect(database.mongo!.collection('participantes').deleteOne).toHaveBeenCalledWith({ name: 'TestUser' });
    });

    it('deve encontrar todos os participantes', async () => {
        const participants = [{ name: 'TestUser', lastStatus: Date.now() }];
        (database.mongo!.collection('participantes').find().toArray as jest.Mock).mockResolvedValue(participants);

        const result = await ParticipantModel.findAll();

        expect(database.mongo!.collection).toHaveBeenCalledWith('participantes');
        expect(database.mongo!.collection('participantes').find().toArray).toHaveBeenCalled();
        expect(result).toEqual(participants);
    });
});
