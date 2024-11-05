import request from 'supertest';
import app from '../../../src/app';
import { createParticipant } from '../../factories/participantFactory';
import { createMessage } from '../../factories/messageFactory';

describe('Rota de Mensagens', () => {
    beforeEach(async () => {
        await createParticipant({ name: 'John Doe' }); // Usuário logado para testes
    });

    it('deve adicionar uma nova mensagem', async () => {
        const response = await request(app)
            .post('/messages')
            .set('user', 'John Doe')
            .send({ to: 'Jane Doe', text: 'Hello, Jane!', type: 'message' });

        expect(response.status).toBe(201);
    });

    it('deve retornar erro de bad request para payload incorreto', async () => {
        const response = await request(app)
            .post('/messages')
            .set('user', 'John Doe')
            .send({ para: 'Jane Doe', texto: 'Hello, Jane!' }); // Campos incorretos

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Formato inválido');
    });

    it('deve retornar erro se o usuário não estiver logado', async () => {
        const response = await request(app)
            .post('/messages')
            .set('user', 'NonExistentUser') // Usuário que não existe
            .send({ to: 'Jane Doe', text: 'Hello, Jane!', type: 'message' });

        expect(response.status).toBe(403);
        expect(response.body.message).toContain('Usuário não logado');
    });

    it('deve listar todas as mensagens visíveis para o usuário', async () => {
        await createMessage({ from: 'John Doe', to: 'Jane Doe', text: 'Hello', type: 'message' });
        await createMessage({ from: 'Jane Doe', to: 'John Doe', text: 'Hi', type: 'private_message' });
        await createMessage({ from: 'Jane Doe', to: 'Jânio Dor', text: 'Cola no rolê', type: 'private_message' });
        await createMessage({ from: 'Maitê Proença', to: 'Jane Doe', text: 'Cola no rolê', type: 'private_message' });

        const response = await request(app)
            .get('/messages')
            .set('user', 'John Doe');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
    });

    it('deve atualizar uma mensagem com sucesso', async () => {
        const message = await createMessage({ from: 'Jane Doe', to: 'John Doe', text: 'Hello', type: 'message' });

        const response = await request(app)
            .put(`/messages/${message._id}`)
            .set('user', 'Jane Doe')
            .send({ text: 'Willy Wonka', to: 'John Doe', type: 'message' });

        expect(response.status).toBe(200);
    });

    it('deve retornar erro se a mensagem não for encontrada para atualização', async () => {
        const response = await request(app)
            .put('/messages/123456789111315171921230')
            .set('user', 'John Doe')
            .send({ text: 'Updated Text', to: 'Jane Doe', type: 'message' });

        expect(response.status).toBe(404);
        expect(response.body.message).toContain('Mensagem não encontrada');
    });

    it('deve retornar erro se o usuário tentar atualizar mensagem sem permissão', async () => {
        const message = await createMessage({ from: 'Jane Doe', to: 'John Doe', text: 'Hello', type: 'message' });

        const response = await request(app)
            .put(`/messages/${message._id}`)
            .set('user', 'John Doe') // Tentando atualizar mensagem de outro usuário
            .send({ text: 'Updated Text', to: 'Jane Doe', type: 'message' });

        expect(response.status).toBe(401);
        expect(response.body.message).toContain('Sem permissão de edição');
    });

    it('deve deletar uma mensagem com sucesso', async () => {
        const message = await createMessage({ from: 'John Doe', to: 'Jane Doe', text: 'Hello', type: 'message' });

        const response = await request(app)
            .delete(`/messages/${message._id}`)
            .set('user', 'John Doe');

        expect(response.status).toBe(200);
    });

    it('deve retornar erro ao tentar deletar mensagem inexistente', async () => {
        const response = await request(app)
            .delete('/messages/123456789111315171921230')
            .set('user', 'John Doe');

        expect(response.status).toBe(404);
        expect(response.body.message).toContain('Mensagem não encontrada');
    });

    it('deve retornar erro ao tentar deletar mensagem sem permissão', async () => {
        const message = await createMessage({ from: 'Jane Doe', to: 'John Doe', text: 'Hello', type: 'message' });

        const response = await request(app)
            .delete(`/messages/${message._id}`)
            .set('user', 'John Doe'); // Tentando deletar mensagem de outro usuário

        expect(response.status).toBe(401);
        expect(response.body.message).toContain('Sem permissão de edição');
    });
});
