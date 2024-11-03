import { db } from '../config/database';
import { ObjectId } from 'mongodb';
import { getCurrentTime } from '../utils/timeUtils';

export interface MessageBase {
    from: string;
    to: string;
    text: string;
    type: string;
}

export interface Message extends MessageBase {
    time: string;
}

export class MessageModel {
    static async findById(id: string): Promise<Message | null> {
        return db.collection('mensagens').findOne({ _id: new ObjectId(id) });
    }

    static async create(message: Message): Promise<void> {
        await db.collection('mensagens').insertOne(message);
    }

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

    static async deleteById(id: string): Promise<void> {
        await db.collection('mensagens').deleteOne({ _id: new ObjectId(id) });
    }

    static async findAll(): Promise<Message[]> {
        return db.collection('mensagens').find().toArray();
    }
}
