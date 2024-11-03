import { MongoClient, Db } from 'mongodb';

const mongoClient = new MongoClient(process.env.URL_CONNECT_MONGO);

export let db: Db;

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
