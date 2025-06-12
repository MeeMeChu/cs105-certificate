import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty', // ให้ log อ่านง่ายใน dev
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    },
  },
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
});

export default logger;
