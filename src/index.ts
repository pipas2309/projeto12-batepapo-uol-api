import app from './app';
import { connectToDatabase } from './config/database';
import { startUserCleanupService } from './services/userCleanupService';
import { logger } from '@infra/config/logger';

import '@infra/config/processHandlers';

const PORT: string = process.env.PORT || '3000';

/** Inicia o servidor depois de se conectar ao banco de dados */
connectToDatabase()
    .then(() => {
        app.listen(parseInt(PORT), () => {
            logger.info(`Servidor rodando na porta ${PORT}`);
        });

        startUserCleanupService();
    })
    .catch(error => {
        logger.error('Erro ao conectar ao banco de dados', { error });
    });
