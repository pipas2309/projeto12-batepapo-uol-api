import dayjs from 'dayjs';

export function getCurrentTime(): string {
    return dayjs().format('HH:mm:ss');
}

export function isUserInactive(lastStatus: number, logoutTime: number): boolean {
    return Date.now() - lastStatus > logoutTime;
}
