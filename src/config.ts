// Look in ./config folder for config
import { InjectionToken } from '@angular/core';

import { Config } from './config/config.interface';
import { ServerConfig } from './config/server-config.interface';
import { GlobalConfig } from './config/global-config.interface';
import { hasValue } from './app/shared/empty.util';

const GLOBAL_CONFIG: InjectionToken<GlobalConfig> = new InjectionToken<GlobalConfig>('config');

const configContext = require.context('../config', false, /js$/);

let production = false;

let ENV_CONFIG: GlobalConfig;

let envConfigOverride: GlobalConfig;

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
    envConfigOverride = configContext(envConfigFile) as GlobalConfig;
  } catch (e) {
    console.warn('Cannot find file ' + envConfigFile.substring(2, envConfigFile.length), 'Using default environment');
  }
  try {
    merge(envConfigOverride);
  } catch (e) {
    console.warn('Unable to merge the default environment');
  }
}

// allow to override a few important options by environment variables
function createServerConfig(host?: string,  port?: string, nameSpace?: string, ssl?: string): ServerConfig {
  const result = { host, nameSpace } as any;

  if (hasValue(port)) {
    result.port = Number(port);
  }

  if (hasValue(ssl)) {
    result.ssl = ssl.trim().match(/^(true|1|yes)$/i) ? true : false;
  }

  return result;
}

const processEnv = {
  ui: createServerConfig(
    process.env.DSPACE_HOST,
    process.env.DSPACE_PORT,
    process.env.DSPACE_NAMESPACE,
    process.env.DSPACE_SSL),
  rest: createServerConfig(
    process.env.DSPACE_REST_HOST,
    process.env.DSPACE_REST_PORT,
    process.env.DSPACE_REST_NAMESPACE,
    process.env.DSPACE_REST_SSL)
} as GlobalConfig;

// merge the environment variables with our configuration.
try {
  merge(processEnv)
} catch (e) {
  console.warn('Unable to merge environment variable into the configuration')
}

buildBaseUrls();

// set config for whether running in production
ENV_CONFIG.production = production;

function merge(config: GlobalConfig): void {
  innerMerge(ENV_CONFIG, config);
}

function innerMerge(globalConfig: Config, config: Config): void {
  for (const key in config) {
    if (config.hasOwnProperty(key)) {
      if (isObject(config[key])) {
        innerMerge(globalConfig[key], config[key]);
      } else {
        if (isDefined(config[key])) {
          globalConfig[key] = config[key];
        }
      }
    }
  }
}

function buildBaseUrls(): void {
  for (const key in ENV_CONFIG) {
    if (ENV_CONFIG.hasOwnProperty(key) && ENV_CONFIG[key].host) {
      ENV_CONFIG[key].baseUrl = [
        getProtocol(ENV_CONFIG[key].ssl),
        getHost(ENV_CONFIG[key].host),
        getPort(ENV_CONFIG[key].port),
        getNameSpace(ENV_CONFIG[key].nameSpace)
      ].join('');
    }
  }
}

function getProtocol(ssl: boolean): string {
  return ssl ? 'https://' : 'http://';
}

function getHost(host: string): string {
  return host;
}

function getPort(port: number): string {
  return port ? (port !== 80 && port !== 443) ? ':' + port : '' : '';
}

function getNameSpace(nameSpace: string): string {
  return nameSpace ? nameSpace.charAt(0) === '/' ? nameSpace : '/' + nameSpace : '';
}

function isDefined(value: any): boolean {
  return typeof value !== 'undefined' && value !== null;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export { GlobalConfig, GLOBAL_CONFIG, ENV_CONFIG }
