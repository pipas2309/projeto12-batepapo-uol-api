/**
 * Arquivo de configuração do bando de dados MongoDB
 * em memória, sendo possível fazer os testes de forma prática
 * e desvinculada do banco real. Garantindo a LGPD e assegurando
 * a usabilidade do código.
 */

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    // Limpa o banco de dados após cada teste
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});
