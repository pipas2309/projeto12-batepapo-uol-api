import { ParticipantModel, Participant } from '../../src/models/participantModel';

export async function createParticipant(overrides?: Partial<Participant>): Promise<Participant> {
    const participantData: Participant = {
        name: 'Test User',
        lastStatus: Date.now(),
        ...overrides,
    };

    await ParticipantModel.create(participantData);
    return participantData;
}
