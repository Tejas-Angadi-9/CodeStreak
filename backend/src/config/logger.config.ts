import { Params } from 'nestjs-pino';
import pino from 'pino';

const loggerConfig: Params = {
  pinoHttp: {
    serializers: {
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    },
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              singleLine: true,
              ignore: 'req,res',
            },
          }
        : undefined,
  },
};

export default loggerConfig;
