import { database } from '../config/database';
import { ObjectId } from 'mongodb';
import { getCurrentTime } from '../utils/timeUtils';

/**
 * Interface base para uma mensagem.
 * @swagger
 * components:
 *   schemas:
 *     MessageBase:
 *       type: object
 *       required:
 *         - from
 *         - to
 *         - text
 *         - type
 *       properties:
 *         from:
 *           type: string
 *         to:
 *           type: string
 *         text:
 *           type: string
 *         type:
 *           type: string
 *           enum: [message, private_message]
 */
export interface MessageBase {
    from: string;
    to: string;
    text: string;
    type: string;
}

/**
 * Interface para uma mensagem completa com tempo.
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       allOf:
 *         - $ref: '#/components/schemas/MessageBase'
 *         - type: object
 *           required:
 *             - time
 *           properties:
 *             time:
 *               type: string
 */
export interface Message extends MessageBase {
    time: string;
    _id?: ObjectId;
}

/** Classe modelo para lidar com mensagens no banco de dados */
export class MessageModel {
    /**
     * Encontra uma mensagem pelo ID.
     * @param id - ID da Mensagem.
     * @returns A promessa de retorno da mensagem ou nulo.
     */
    static async findById(id: string): Promise<Message | null> {
        return database.mongo!.collection<Message>('mensagens').findOne({ _id: new ObjectId(id) });
    }

    /**
     * Cria uma nova mensagem.
     * @param message {Message} - A mensagem a ser salva.
     */
    static async create(message: Message): Promise<string> {
        const response = await database.mongo!.collection('mensagens').insertOne(message);
        return response.insertedId.toString();
    }

    /**
     * Atualiza o texto de uma mensagem.
     * @param id - ID da mensagem.
     * @param text - Novo texto da mensagem.
     */
    static async update(id: string, text: string): Promise<void> {
        await database.mongo!.collection('mensagens').updateOne(
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
        await database.mongo!.collection('mensagens').deleteOne({ _id: new ObjectId(id) });
    }

    /**
     * Recupera todas as mensagens.
     * @returns A promessa de retorno do array de mensagem.
     */
    static async findAll(): Promise<Message[]> {
        return database.mongo!.collection<Message>('mensagens').find().toArray();
    }
}
