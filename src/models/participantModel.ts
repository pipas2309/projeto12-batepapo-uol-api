import { db } from '../config/database';

export interface Participant {
    name: string;
    lastStatus: number;
}

export class ParticipantModel {
    static async findByName(name: string): Promise<Participant | null> {
        return db.collection('participantes').findOne({ name });
    }

    static async create(participant: Participant): Promise<void> {
        await db.collection('participantes').insertOne(participant);
    }

    static async updateLastStatus(name: string, lastStatus: number): Promise<void> {
        await db.collection('participantes').updateOne({ name }, { $set: { lastStatus } });
    }

    static async deleteByName(name: string): Promise<void> {
        await db.collection('participantes').deleteOne({ name });
    }

    static async findAll(): Promise<Participant[]> {
        return db.collection('participantes').find().toArray();
    }
}
