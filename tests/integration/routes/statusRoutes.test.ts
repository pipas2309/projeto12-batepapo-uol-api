import request from 'supertest';
import app from '../../../src/app';
import { createParticipant } from '../../factories/participantFactory';

describe('Rota de Status', () => {
    beforeEach(async () => {
        await createParticipant({ name: 'John Doe' });
    });

    it('deve atualizar o status do participante com sucesso', async () => {
        const response = await request(app)
            .post('/status')
            .set('user', 'John Doe');

        expect(response.status).toBe(200);
    });

    it('deve retornar erro de não encontrado se o participante não existir', async () => {
        const response = await request(app)
            .post('/status')
            .set('user', 'NonExistentUser');

        expect(response.status).toBe(404);
        expect(response.body.message).toContain('Participante não encontrado');
    });
});
