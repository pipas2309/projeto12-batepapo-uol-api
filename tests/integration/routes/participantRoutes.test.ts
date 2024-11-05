import request from 'supertest';
import app from '../../../src/app';
import { createParticipant } from '../../factories/participantFactory';

describe('Rota dos Participantes', () => {
    it('deve adicionar um novo participante', async () => {
        const response = await request(app)
            .post('/participants')
            .send({ name: 'John Doe' });

        expect(response.status).toBe(201);

        const participant = await createParticipant({ name: 'John Doe' });
        expect(participant.name).toBe('John Doe');
    });

    it('deve disparar um erro de bad request', async () => {
        const response = await request(app)
            .post('/participants')
            .send({ names: 'John Doe' });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Formato inválido');
    });

    it('deve não adicionar um participante com nome duplicado', async () => {
        await createParticipant({ name: 'John Doe' });

        const response = await request(app)
            .post('/participants')
            .send({ name: 'John Doe' });

        expect(response.status).toBe(409);
        expect(response.body.message).toContain('já está em uso');
    });

    it('deve retornar a lista com todos os participantes', async () => {
        await createParticipant({ name: 'John Doe' });
        await createParticipant({ name: 'Jane Doe' });

        const response = await request(app).get('/participants');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
    });
});
