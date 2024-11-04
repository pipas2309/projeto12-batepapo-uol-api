import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { database } from '../src/config/database';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {});

    const client = mongoose.connection.getClient();
    database.mongo = client.db();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    // Limpa o banco de dados após cada teste
    const participantes = mongoose.connection.collection('participantes');
    const mensagens = mongoose.connection.collection('mensagens');
    if (participantes) {
        await participantes.deleteMany({});
    }
    if (mensagens) {
        await mensagens.deleteMany({});
    }
});
