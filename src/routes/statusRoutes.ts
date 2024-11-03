import { Router } from 'express';
import { updateStatus } from '../controllers/statusController';

const statusRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Status
 *   description: Rota para atualização de status de participante.
 */

/**
 * @swagger
 * /status:
 *   post:
 *     summary: Atualiza o status do participante.
 *     tags: [Status]
 *     parameters:
 *       - in: header
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do usuário.
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 */
statusRouter.post('/status', updateStatus);

export default statusRouter;
