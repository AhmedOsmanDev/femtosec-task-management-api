import winston from 'winston';

const { combine, colorize, timestamp, align, printf } = winston.format;

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL,
    format: combine(
        colorize({ all: true }),
        timestamp(),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [new winston.transports.Console()],
});

export default logger;
