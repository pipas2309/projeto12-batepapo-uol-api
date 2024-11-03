import { Router } from 'express';
import { getParticipants, addParticipant } from '../controllers/participantController';

const participantRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Participantes
 *   description: Rotas relacionadas a participantes.
 */

/**
 * @swagger
 * /participants:
 *   get:
 *     summary: Obtém todos os participantes.
 *     tags: [Participantes]
 *     responses:
 *       200:
 *         description: Lista de participantes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Participant'
 */
participantRouter.get('/participants', getParticipants);

/**
 * @swagger
 * /participants:
 *   post:
 *     summary: Adiciona um novo participante.
 *     tags: [Participantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParticipantInput'
 *     responses:
 *       201:
 *         description: Participante criado com sucesso.
 *       400:
 *         description: Formato inválido.
 *       409:
 *         description: Nome de usuário já está em uso.
 */
participantRouter.post('/participants', addParticipant);

export default participantRouter;
