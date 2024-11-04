import { database } from '../config/database';

/**
 * Interface representando um participante.
 * @swagger
 * components:
 *   schemas:
 *     Participant:
 *       type: object
 *       required:
 *         - name
 *         - lastStatus
 *       properties:
 *         name:
 *           type: string
 *         lastStatus:
 *           type: integer
 *           format: int64
 *           description: Timestamp do último status do participante.
 */
export interface Participant {
    name: string;
    lastStatus: number;
}

/**
 * Interface representando os dados necessários para criar um participante.
 * @swagger
 * components:
 *   schemas:
 *     ParticipantInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 */
export interface ParticipantInput {
    name: string;
}

/** Classe modelo para lidar com participantes no banco de dados */
export class ParticipantModel {
    /**
     * Encontra um participante pelo nome.
     * @param name - Nome do participante.
     * @returns A promessa de retorno da mensagem ou nulo.
     */
    static async findByName(name: string): Promise<Participant | null> {
        return database.mongo!.collection<Participant>('participantes').findOne({ name });
    }

    /**
     * Cria um novo participante.
     * @param participant {Participant} - Participante a ser salvo.
     */
    static async create(participant: Participant): Promise<void> {
        await database.mongo!.collection('participantes').insertOne(participant);
    }

    /**
     * Atualiza o status de um participante.
     * @param name - Nome do participante.
     * @param lastStatus - Novo timestamp.
     */
    static async updateLastStatus(name: string, lastStatus: number): Promise<void> {
        await database.mongo!.collection('participantes').updateOne({ name }, { $set: { lastStatus } });
    }

    /**
     * Deleta um participante pelo nome.
     * @param name - Nome do participante.
     */
    static async deleteByName(name: string): Promise<void> {
        await database.mongo!.collection('participantes').deleteOne({ name });
    }

    /**
     * Recupera todos os participantes.
     * @returns A promessa de retorno do array de participante.
     */
    static async findAll(): Promise<Participant[]> {
        return database.mongo!.collection<Participant>('participantes').find().toArray();
    }
}
