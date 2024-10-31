import {
    createLogger,
    transports
    } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { format as logformat } from 'logform';
import { environment } from 'src/environments/environment';

/* See [winston](https://www.npmjs.com/package/winston) */

/* Create transport appropriate to environment. */
var log_transport;

if (typeof(window) !== 'undefined') {
    log_transport = new transports.Console({
        stderrLevels: ['error', 'warn'],
        consoleWarnLevels: ['error', 'warn'],
        });
} else {
    log_transport = new transports.DailyRotateFile({
      filename: 'server-%DATE%.log',
      createSymlink: true,
      symlinkName: 'server-current.log',
      maxFiles: environment.logging.main.maxFiles || 10,
      // maxSize:
      // utc:
      // level:
      // dirname:
    });
}

/**
 * Create logger.
 */
const logger = createLogger({
  level: environment.logging.main.level || 'info',
  format: logformat.combine(
    logformat.timestamp(),
    logformat.splat(),
    logformat.simple()
  ),
  transports: [
    log_transport,
  ],
  exceptionHandlers: [
    log_transport,
  ],
  exitOnError: false,
  rejectionHandlers: [
    log_transport,
  ],
});

export default logger;
