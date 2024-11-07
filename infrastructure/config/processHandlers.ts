import { logger } from '@infra/config/logger';

/**
 * Garante que em caso de exceções ou 'promises' não tratadas
 * o servidor vai ter o Log correto.
 */
process.on('uncaughtException', (err) => {
    logger.error('Exceção não tratada:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.error('Rejeição de Promise não tratada:', reason);
    process.exit(1);
});
