import { getCurrentTime } from '../utils/timeUtils';
import { ParticipantModel } from '../models/participantModel';
import { Message, MessageModel } from '../models/messageModel';

export function startUserCleanupService(): void {
    setInterval(async () => {
        try {
            const participantsOnline = await ParticipantModel.findAll();

            for (const participant of participantsOnline) {
                if (Date.now() - participant.lastStatus > Number(process.env.LOGOUT_TIME)) {
                    const user = participant.name;

                    const logoutMessage: Message = {
                        from: user,
                        to: 'Todos',
                        text: 'sai da sala...',
                        type: 'status',
                        time: getCurrentTime(),
                    };

                    await ParticipantModel.deleteByName(user);
                    await MessageModel.create(logoutMessage);
                }
            }
        } catch (error) {
            console.error('Erro no serviço de limpeza de usuários:', error);
        }
    }, Number(process.env.ACTIVITY_CHECKER_TIME));
}
