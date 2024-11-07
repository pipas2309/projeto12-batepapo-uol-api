import { createLogger, format, transports, addColors } from 'winston';
import path from 'path';
import fs from 'fs';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
});

const logDir = path.resolve('logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const customFormat = format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
    levels,
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        customFormat
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize({ all: true }),
                customFormat
            ),
        }),
        new transports.File({ filename: path.join(logDir, 'app.log') }),
    ],
    exceptionHandlers: [
        new transports.File({ filename: path.join(logDir, 'exceptions.log') }),
    ],
    rejectionHandlers: [
        new transports.File({ filename: path.join(logDir, 'rejections.log') }),
    ],
});

export { logger };
