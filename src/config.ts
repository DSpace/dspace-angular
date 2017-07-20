// Look in ./config folder for config
import { InjectionToken } from '@angular/core';

import { ServerConfig } from './config/server-config.interface';
import { GlobalConfig } from './config/global-config.interface';

const GLOBAL_CONFIG: InjectionToken<GlobalConfig> = new InjectionToken<GlobalConfig>('config');

const configContext = require.context('../config', false, /js$/);

let production = false;

let ENV_CONFIG: GlobalConfig;

let envConfigFile: string;

// check process.env.NODE_ENV to determine which environment config to use
// process.env.NODE_ENV is defined by webpack, else assume development
switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    // webpack.prod.config.ts defines process.env.NODE_ENV = 'production'
    envConfigFile = './environment.prod.js';
    production = true;
    break;
  case 'test':
    // webpack.test.config.ts defines process.env.NODE_ENV = 'test'
    envConfigFile = './environment.test.js';
    break;
  default:
    // if not using webpack.prod.config.ts or webpack.test.config.ts, it must be development
    envConfigFile = './environment.dev.js';
}

try {
  ENV_CONFIG = configContext('./environment.default.js') as GlobalConfig;
} catch (e) {
  throw new Error('Cannot find file config/environment.default.js');
}

// if envConfigFile set try to get configs
if (envConfigFile) {
  try {
    ENV_CONFIG = Object.assign(ENV_CONFIG, configContext(envConfigFile)) as GlobalConfig;
  } catch (e) {
    console.warn('Cannot find file ' + envConfigFile.substring(2, envConfigFile.length), 'Using default environment.');
  }
}

// set config for whether running in production
ENV_CONFIG.production = production;

// set base url if property is object with ssl, address, and port. i.e. ServerConfig
for (const key in ENV_CONFIG) {
  if (ENV_CONFIG[key].host) {
    ENV_CONFIG[key].baseUrl = [
      ENV_CONFIG[key].ssl ? 'https://' : 'http://',
      ENV_CONFIG[key].host,
      ENV_CONFIG[key].port ? (ENV_CONFIG[key].port !== 80 && ENV_CONFIG[key].port !== 443) ? ':' + ENV_CONFIG[key].port : '' : ''
    ].join('');
  }
}

export { GlobalConfig, GLOBAL_CONFIG, ENV_CONFIG }
