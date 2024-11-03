import dayjs from 'dayjs';

/**
 * Pega a data atual no formato HH:mm:ss.
 * @returns {string} Data atual.
 */
export function getCurrentTime(): string {
    return dayjs().format('HH:mm:ss');
}
