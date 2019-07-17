import express from 'express';
import multer from 'multer';
import untildify from 'untildify';
import * as _ from 'underscore';
import { createLogger, createMiddleware } from './logger';
import { ApiMocker, configOptions } from 'apimocker';
import { AnyWebService } from './models';

type ApiMockerConfig = configOptions & {
  uploadRoot?: string;
  proxyURL?: string;
};
/**
 * @TODO declare const defaults in @types/apimocker
 */
const apiMocker: Partial<ApiMocker> & {
  defaults?: Partial<configOptions>;
  options?: ApiMockerConfig;
  createServer?: (options: configOptions) => ApiMocker;
} = {};

const webServices: { [endpoint: string]: AnyWebService } = {};

apiMocker.defaults = {
  port: '8888',
  mockDirectory: './mocks/',
  allowedDomains: ['*'],
  allowedHeaders: ['Content-Type'],
  logRequestHeaders: false,
  allowAvoidPreFlight: false,
  useUploadFieldname: false,
  webServices,
};

apiMocker.createServer = (options: ApiMockerConfig) => {
  apiMocker.options = Object.assign({}, apiMocker.defaults, options);

  const { quiet } = apiMocker.options;
  const logger = createLogger({ quiet });
  const loggerMiddleware = createMiddleware({ quiet });

  apiMocker.express = express();
  apiMocker.middlewares = [];

  apiMocker.middlewares.push(loggerMiddleware);
  if (options.uploadRoot) {
    apiMocker.middlewares.push(
      multer({
        storage: multer.diskStorage({
          destination: untildify(options.uploadRoot),
          filename: options.useUploadFieldname
            ? (req, filename, cb) => {
                cb(null, filename.fieldname);
              }
            : (req, filename, cb) => {
                cb(null, filename.originalname);
              },
        }),
      }).any()
    );
  }

  let saveBody;
  if (options.proxyURL || options.allowAvoidPreFlight) {
    saveBody = (
      req: express.Request & { rawBody?: any },
      res: express.Response,
      buf: any
    ) => {
      req.rawBody = buf;
    };
  }

  return apiMocker as ApiMocker;
};
