// Look in ./config folder for config
import { OpaqueToken } from '@angular/core';

interface ServerConfig {
  "nameSpace": string;
  "protocol": string;
  "address": string;
  "port": number;
  "baseUrl": string;
}

interface GlobalConfig {
  "production": boolean;
  "rest": ServerConfig;
  "ui": ServerConfig;
  "cache": {
    "msToLive": number,
    "control": string
  };
  "universal": {
    "preboot": boolean,
    "async": boolean
  };
}

const GLOBAL_CONFIG = new OpaqueToken('config');

let configContext = require.context("../config", false, /js$/);

let EnvConfig: GlobalConfig;
let EnvConfigFile: string;

let production: boolean = false;

switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    production = true;
    EnvConfigFile = './environment.prod.js';
    break;
  case 'dev':
  case 'development':
    EnvConfigFile = './environment.dev.js';
    break;
  case 'test':
    EnvConfigFile = './environment.test.js';
    break;
  default:
    console.warn('Environment file not specified. Using default.');
}

try {
  EnvConfig = configContext('./environment.default.js');
} catch (e) {
  throw new Error("Cannot find file ./environment.default.js");
}

// if EnvConfigFile set try to get configs
if (EnvConfigFile) {
  try {
    EnvConfig = <GlobalConfig>Object.assign(EnvConfig, configContext(EnvConfigFile));
  } catch (e) {
    console.warn("Cannot find file " + EnvConfigFile);
  }
}

// set base url if propery is object with protocol, address, and port. i.e. ServerConfig
for (let key in EnvConfig) {
  if (EnvConfig[key].protocol && EnvConfig[key].address && EnvConfig[key].port) {
    EnvConfig[key].baseUrl = [EnvConfig[key].protocol, '://', EnvConfig[key].address, (EnvConfig[key].port !== 80) ? ':' + EnvConfig[key].port : ''].join('');
  }
}

// set config for running in production
EnvConfig.production = production;

export { GLOBAL_CONFIG, GlobalConfig, EnvConfig }
