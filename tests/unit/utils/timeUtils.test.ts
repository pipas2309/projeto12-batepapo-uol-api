import { getCurrentTime } from '../../../src/utils/timeUtils';
import dayjs from 'dayjs';

describe('getCurrentTime', () => {
    it('deve retornar o horário atual no formato HH:mm:ss', () => {
        const time: string = getCurrentTime();
        const timeNow: number = Date.now();

        jest.mock('dayjs', () => {
            return () => ({
                format: jest.fn().mockReturnValue(timeNow.toString()),
            });
        });

        const date = new Date(timeNow);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes}:${seconds}`;

        expect(formattedTime).toBe(time);

        jest.restoreAllMocks();
    });
});
