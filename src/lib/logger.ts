import pino from 'pino';
import { Logger } from 'pino';

export const logger: Logger = pino({
  // transport: {
  //   target: 'pino-pretty',
  //   options: {
  //     colorize: true,
  //   },
  // },
  level: process.env.PINO_LOG_LEVEL || 'debug',

  redact: [], // prevent logging of sensitive data
});