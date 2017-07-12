import { InjectionToken } from '@angular/core';

import { ServerConfig } from './config/server-config.interface';
import { GlobalConfig } from './config/global-config.interface';

const GLOBAL_CONFIG: InjectionToken<GlobalConfig> = new InjectionToken<GlobalConfig>('config');

let production = false;

let ENV_CONFIG: GlobalConfig;

try {
  ENV_CONFIG = require('../config/environment.default.js') as GlobalConfig;
} catch (e) {
  throw new Error('Cannot find file config/environment.default.js');
}

switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    production = true;
    try {
      ENV_CONFIG = Object.assign(ENV_CONFIG, require('../config/environment.prod.js')) as GlobalConfig;
    } catch (e) {
      console.warn('Cannot find file config/environment.prod.js', 'Using default environment.');
    }
    break;
  case 'test':
    try {
      ENV_CONFIG = Object.assign(ENV_CONFIG, require('../config/environment.test.js')) as GlobalConfig;
    } catch (e) {
      console.warn('Cannot find file config/environment.test.js', 'Using default environment.');
    }
    break;
  default:
    try {
      ENV_CONFIG = Object.assign(ENV_CONFIG, require('../config/environment.dev.js')) as GlobalConfig;
    } catch (e) {
      console.warn('Cannot find file config/environment.dev.js', 'Using default environment.');
    }
}

ENV_CONFIG.production = production;

for (const key in ENV_CONFIG) {
  if (ENV_CONFIG[key].host) {
    ENV_CONFIG[key].baseUrl = [
      ENV_CONFIG[key].ssl ? 'https://' : 'http://',
      ENV_CONFIG[key].host,
      ENV_CONFIG[key].port ? (ENV_CONFIG[key].port !== 80 || ENV_CONFIG[key].port !== 443) ? ':' + ENV_CONFIG[key].port : '' : ''
    ].join('');
  }
}

export { GlobalConfig, GLOBAL_CONFIG, ENV_CONFIG }
