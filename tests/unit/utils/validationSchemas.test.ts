import { participantSchema, messageSchema } from '../../../src/utils/validationSchemas';

describe('Validation Schemas', () => {
    describe('Participant Schema', () => {
        it('deve validar um participante com dados corretos', () => {
            const validParticipant = { name: 'TestUser' };
            const result = participantSchema.validate(validParticipant);
            expect(result.error).toBeUndefined();
        });

        it('deve retornar erro para participante com dados inválidos', () => {
            const invalidParticipant = { names: 'TestUser' };
            const result = participantSchema.validate(invalidParticipant);
            expect(result.error).toBeDefined();
        });
    });

    describe('Message Schema', () => {
        it('deve validar uma mensagem com dados corretos', () => {
            const validMessage = { from: 'User1', to: 'User2', text: 'Hello', type: 'message' };
            const result = messageSchema.validate(validMessage);
            expect(result.error).toBeUndefined();
        });

        it('deve retornar erro para mensagem com dados inválidos', () => {
            const invalidMessage = { from: 'User1', text: 'Hello' };
            const result = messageSchema.validate(invalidMessage);
            expect(result.error).toBeDefined();
        });
    });
});
