import chalk from 'chalk';
import path from 'path';
import jsonf from 'jsonfile';
import { Request, Response, NextFunction } from 'express';

const pkg = jsonf.readFileSync(path.resolve(__dirname, 'package.json'));

const prefix = `[${pkg.name}]`;

const colors = {
  info: chalk.gray,
  warn: chalk.keyword('orange'),
  error: chalk.red,
  success: chalk.green,
};

// eslint-disable-next-line no-console
const log = (color: any, ...msg: any[]) => console.log(color(prefix), ...msg);

const logger = {
  info: (...msg: any[]) => log(colors.info, ...msg),
  warn: (...msg: any[]) => log(colors.warn, ...msg),
  error: (...msg: any[]) => log(colors.error, ...msg),
};

export const createLogger = ({ quiet }: { [k: string]: any }) =>
  new Proxy(logger, {
    // Silence logger methods by stubbing them out.
    get: (target: any, prop) => (quiet ? () => {} : target[prop]),
  });

export const createMiddleware = ({ quiet }: { [k: string]: any }) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!quiet) {
    const start = Date.now();
    res.on('finish', () => {
      const method = req.method.toUpperCase();
      const url = req.originalUrl;
      const status = res.statusCode;
      const mockFile = res.locals.mockFile || '';
      const responseTime = Date.now() - start;

      if (res.statusCode >= 400) {
        logger.error(
          `${chalk.bold(method)} ${url} ⏎ ${colors.error(
            String(status)
          )} ${mockFile} - ${responseTime}ms`
        );
      } else {
        logger.info(
          `${chalk.bold(method)} ${url} ⏎ ${colors.success(
            String(status)
          )} ${mockFile} - ${responseTime}ms`
        );
      }
    });
  }
  next();
};
