import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'doppler-mcp-server' },
  transports: [
    // Write all logs to stderr (as required by MCP)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      stderrLevels: ['error', 'warn', 'info', 'debug'],
    }),
  ],
});

// Create a stream object with a 'write' function that will be used by morgan
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};