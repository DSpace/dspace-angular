// Look in ./config folder for config
import { OpaqueToken } from '@angular/core';

import * as path from 'path';

let configContext = require.context("../config", false, /js$/);

let EnvConfig: any = {};
let EnvConfigFile: string;
let DefaultConfig: any = {};

try {
  DefaultConfig = configContext('./environment.default.js');
} catch (e) {
  throw new Error(`Cannot find file "${path.resolve('config', './environment.default.js')}"`);
}

switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    EnvConfigFile = './environment.prod.js';
    break;
  case 'dev':
  case 'development':
  default:
    EnvConfigFile = './environment.dev.js';
}
try {
  EnvConfig = configContext(EnvConfigFile);
} catch (e) {
  EnvConfig = {};
}

const GLOBAL_CONFIG = new OpaqueToken('config');

interface ServerConfig {
  "nameSpace": string,
  "protocol": string,
  "address": string,
  "port": number,
  "baseURL": string
}

interface GlobalConfig {
  "production": string,
  "rest": ServerConfig,
  "ui": ServerConfig,
  "cache": {
    "msToLive": number,
  },
  "universal": {
    "shouldRehydrate": boolean,
    "preboot": boolean,
    "async": boolean
  }
}

const config: GlobalConfig = <GlobalConfig>Object.assign(DefaultConfig, EnvConfig);

function buildURL(server: ServerConfig) {
  return [server.protocol, '://', server.address, (server.port !== 80) ? ':' + server.port : ''].join('');
}

for (let key in config) {
  if (config[key].protocol && config[key].address && config[key].port) {
    config[key].baseURL = buildURL(config[key]);
  }
}

const globalConfig = {
  provide: GLOBAL_CONFIG,
  useValue: config
};

export { GLOBAL_CONFIG, GlobalConfig, globalConfig, config }
