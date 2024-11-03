import { db } from '../config/database';

/** Interface que representa um participante */
export interface Participant {
    name: string;
    lastStatus: number;
}

/** Classe modelo para lidar com participantes no banco de dados */
export class ParticipantModel {
    /**
     * Encontra um participante pelo nome.
     * @param name - Nome do participante.
     * @returns A promessa de retorno da mensagem ou nulo.
     */
    static async findByName(name: string): Promise<Participant | null> {
        return db.collection<Participant>('participantes').findOne({ name });
    }

    /**
     * Cria um novo participante.
     * @param participant {Participant} - Participante a ser salvo.
     */
    static async create(participant: Participant): Promise<void> {
        await db.collection('participantes').insertOne(participant);
    }

    /**
     * Atualiza o status de um participante.
     * @param name - Nome do participante.
     * @param lastStatus - Novo timestamp.
     */
    static async updateLastStatus(name: string, lastStatus: number): Promise<void> {
        await db.collection('participantes').updateOne({ name }, { $set: { lastStatus } });
    }

    /**
     * Deleta um participante pelo nome.
     * @param name - Nome do participante.
     */
    static async deleteByName(name: string): Promise<void> {
        await db.collection('participantes').deleteOne({ name });
    }

    /**
     * Recupera todos os participantes.
     * @returns A promessa de retorno do array de participante.
     */
    static async findAll(): Promise<Participant[]> {
        return db.collection<Participant>('participantes').find().toArray();
    }
}
