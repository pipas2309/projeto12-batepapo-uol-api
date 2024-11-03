import { MongoClient, Db } from 'mongodb';

const mongoClient = new MongoClient(process.env.URL_CONNECT_MONGO);

/** Instância do banco de dados MongoDB. */
export let db: Db;

/**
 * Conecta-se ao banco de dados MongoDB.
 * @async
 * @return {Promise<void>} Uma 'Promise' que resolve quando a conexão com o BD é estabelecida.
 * @throws {Error} Se houver um problema ao conectar.
 */
export async function connectToDatabase(): Promise<void> {
    try {
        await mongoClient.connect();
        db = mongoClient.db('bate-papo');
        console.log('Conectado ao MongoDB');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        throw error;
    }
}
