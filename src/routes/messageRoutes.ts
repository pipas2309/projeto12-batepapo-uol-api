import { Router } from 'express';
import { getMessages, addMessage, updateMessage, deleteMessage } from '../controllers/messageController';

const messageRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Mensagens
 *   description: Rotas relacionadas a mensagens.
 */

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Obtém mensagens filtradas por usuário e tipo de mensagem.
 *     tags: [Mensagens]
 *     parameters:
 *       - in: header
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do usuário.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Limite de mensagens a serem retornadas.
 *     responses:
 *       200:
 *         description: Lista de mensagens.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
messageRouter.get('/messages', getMessages);

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Adiciona uma nova mensagem.
 *     tags: [Mensagens]
 *     parameters:
 *       - in: header
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MessageBase'
 *     responses:
 *       201:
 *         description: Mensagem criada com sucesso.
 *       400:
 *         description: Formato inválido.
 *       403:
 *         description: Usuário não logado.
 */
messageRouter.post('/messages', addMessage);

/**
 * @swagger
 * /messages/{id}:
 *   put:
 *     summary: Atualiza uma mensagem existente.
 *     tags: [Mensagens]
 *     parameters:
 *       - in: header
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do usuário.
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da mensagem.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MessageBase'
 *     responses:
 *       200:
 *         description: Mensagem atualizada com sucesso.
 *       400:
 *         description: Formato inválido.
 *       404:
 *         description: Mensagem não encontrada.
 *       401:
 *         description: Sem permissão de edição.
 */
messageRouter.put('/messages/:id', updateMessage);

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     summary: Deleta uma mensagem.
 *     tags: [Mensagens]
 *     parameters:
 *       - in: header
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do usuário.
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da mensagem.
 *     responses:
 *       200:
 *         description: Mensagem deletada com sucesso.
 *       404:
 *         description: Mensagem não encontrada.
 *       401:
 *         description: Sem permissão de edição.
 */
messageRouter.delete('/messages/:id', deleteMessage);

export default messageRouter;
