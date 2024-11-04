import { MongoClient, Db } from 'mongodb';

const url = process.env.NODE_ENV === 'test' ? process.env.URL_CONNECT_MONGO_TEST : process.env.URL_CONNECT_MONGO;
const mongoClient = new MongoClient(url);

/** Instância do banco de dados MongoDB. */
export const database = {
    mongo: null as Db | null,
};

/**
 * Conecta-se ao banco de dados MongoDB.
 * @async
 * @return {Promise<void>} Uma 'Promise' que resolve quando a conexão com o BD é estabelecida.
 * @throws {Error} Se houver um problema ao conectar.
 */
export async function connectToDatabase(): Promise<void> {
    try {
        await mongoClient.connect();
        database.mongo = mongoClient.db('bate-papo');
        console.log('Conectado ao MongoDB');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        throw error;
    }
}
