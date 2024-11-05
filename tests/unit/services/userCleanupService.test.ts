import { cleanupInactiveUsers, startUserCleanupService } from '../../../src/services/userCleanupService';
import { ParticipantModel } from '../../../src/models/participantModel';
import { MessageModel } from '../../../src/models/messageModel';
import { getCurrentTime } from '../../../src/utils/timeUtils';

jest.mock('../../../src/models/participantModel');
jest.mock('../../../src/models/messageModel');
jest.mock('../../../src/utils/timeUtils', () => ({
    getCurrentTime: jest.fn(() => '12:00:00')
}));

describe('User Cleanup Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(global.Date, 'now').mockImplementation(() => 1000000000000); // Fixa Date.now() para testes
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe('cleanupInactiveUsers', () => {
        it('deve remover participantes inativos e criar mensagem de logout', async () => {
            const participants = [{ name: 'InactiveUser', lastStatus: Date.now() - 600000 }];
            (ParticipantModel.findAll as jest.Mock).mockResolvedValue(participants);
            (ParticipantModel.deleteByName as jest.Mock).mockResolvedValue(undefined);
            (MessageModel.create as jest.Mock).mockResolvedValue(undefined);

            await cleanupInactiveUsers();

            expect(ParticipantModel.findAll).toHaveBeenCalled();
            expect(ParticipantModel.deleteByName).toHaveBeenCalledWith('InactiveUser');
            expect(MessageModel.create).toHaveBeenCalledWith({
                from: 'InactiveUser',
                to: 'Todos',
                text: 'sai da sala...',
                type: 'status',
                time: '12:00:00'
            });
        });

        it('deve capturar erro no console se falhar durante a execução', async () => {
            console.error = jest.fn();
            (ParticipantModel.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

            await cleanupInactiveUsers();

            expect(console.error).toHaveBeenCalledWith('Erro no serviço de limpeza de usuários:', expect.any(Error));
        });
    });

    describe('startUserCleanupService', () => {
        it('deve agendar o cleanupInactiveUsers com setInterval', () => {
            const setIntervalSpy = jest.spyOn(global, 'setInterval'); // Monitoramos setInterval
            startUserCleanupService();

            expect(setIntervalSpy).toHaveBeenCalledWith(cleanupInactiveUsers, Number(process.env.ACTIVITY_CHECKER_TIME));
            setIntervalSpy.mockRestore(); // Limpa o mock de setInterval após o teste
        });
    });
});
