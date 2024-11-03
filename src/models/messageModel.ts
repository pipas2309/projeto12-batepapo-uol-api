import { db } from '../config/database';
import { ObjectId } from 'mongodb';
import { getCurrentTime } from '../utils/timeUtils';

/** Interface básica de uma mensagem */
export interface MessageBase {
    from: string;
    to: string;
    text: string;
    type: string;
}

/** Interface completa de uma mensagem */
export interface Message extends MessageBase {
    time: string;
}

/** Classe modelo para lidar com mensagens no banco de dados */
export class MessageModel {
    /**
     * Encontra uma mensagem pelo ID.
     * @param id - ID da Mensagem.
     * @returns A promessa de retorno da mensagem ou nulo.
     */
    static async findById(id: string): Promise<Message | null> {
        return db.collection<Message>('mensagens').findOne({ _id: new ObjectId(id) });
    }

    /**
     * Cria uma nova mensagem.
     * @param message {Message} - A mensagem a ser salva.
     */
    static async create(message: Message): Promise<void> {
        await db.collection('mensagens').insertOne(message);
    }

    /**
     * Atualiza o texto de uma mensagem.
     * @param id - ID da mensagem.
     * @param text - Novo texto da mensagem.
     */
    static async update(id: string, text: string): Promise<void> {
        await db.collection('mensagens').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    text,
                    time: getCurrentTime(),
                },
            },
        );
    }

    /**
     * Deleta uma mensagem pelo ID.
     * @param id - ID da mensagem.
     */
    static async deleteById(id: string): Promise<void> {
        await db.collection('mensagens').deleteOne({ _id: new ObjectId(id) });
    }

    /**
     * Recupera todas as mensagens.
     * @returns A promessa de retorno do array de mensagem.
     */
    static async findAll(): Promise<Message[]> {
        return db.collection<Message>('mensagens').find().toArray();
    }
}
