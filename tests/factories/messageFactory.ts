import { Message, MessageModel } from '../../src/models/messageModel';
import { getCurrentTime } from '../../src/utils/timeUtils';
import { ObjectId } from 'mongodb';

export async function createMessage(overrides?: Partial<Message>): Promise<Message> {
    const messageData: Message = {
        from: 'Test User A',
        to: 'Test User B',
        text: 'Hi brow',
        type: 'message',
        time: getCurrentTime(),
        _id: new ObjectId(),
        ...overrides,
    };

    await MessageModel.create(messageData);
    return messageData;
}
