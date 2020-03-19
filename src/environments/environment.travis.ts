import { environment as defaultEnv } from './environment.common';
import { GlobalConfig } from '../config/global-config.interface';
import { ServerConfig } from '../config/server-config.interface';

export const environment: GlobalConfig = {
    ...defaultEnv,
    rest: new ServerConfig(
      false,
      'localhost',
      8080,
      // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
      '/server/api',
    ),
};
