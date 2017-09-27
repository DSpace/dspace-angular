// Look in ./config folder for config
import { InjectionToken } from '@angular/core';

import { Config } from './config/config.interface';
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
    merge(configContext(envConfigFile) as GlobalConfig);
  } catch (e) {
    console.warn('Cannot find file ' + envConfigFile.substring(2, envConfigFile.length), 'Using default environment.');
  }
}

// set config for whether running in production
ENV_CONFIG.production = production;

function merge(config: GlobalConfig): void {
  innerMerge(ENV_CONFIG, config);
  buildBaseUrls();
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
        getContextPath(ENV_CONFIG[key].contextPath)
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

function getContextPath(contextPath: string): string {
  return contextPath ? '/' + contextPath : '';
}

function isDefined(value: any): boolean {
  return typeof value !== 'undefined' && value !== null;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export { GlobalConfig, GLOBAL_CONFIG, ENV_CONFIG }
