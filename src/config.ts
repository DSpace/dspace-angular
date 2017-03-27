// Look in ./config folder for config
import { OpaqueToken } from '@angular/core';

interface ServerConfig {
  "ssl": boolean;
  "address": string;
  "port": number;
  "nameSpace": string;
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

// check process.env.NODE_ENV to determine which environment config to use
// process.env.NODE_ENV is defined by webpack, else assume development
switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    // webpack.prod.config.ts defines process.env.NODE_ENV = 'production'
    EnvConfigFile = './environment.prod.js';
    production = true;
    break;
  case 'test':
    // webpack.test.config.ts defines process.env.NODE_ENV = 'test'
    EnvConfigFile = './environment.test.js';
    break;
  default:
    // if not using webpack.prod.config.ts or webpack.test.config.ts, it must be development
    EnvConfigFile = './environment.dev.js';
}

try {
  EnvConfig = configContext('./environment.default.js');
} catch (e) {
  throw new Error("Cannot find file environment.default.js");
}

// if EnvConfigFile set try to get configs
if (EnvConfigFile) {
  try {
    EnvConfig = <GlobalConfig>Object.assign(EnvConfig, configContext(EnvConfigFile));
  } catch (e) {
    console.warn("Cannot find file " + EnvConfigFile.substring(2, EnvConfigFile.length), "Using default environment.");
  }
}

// set base url if property is object with ssl, address, and port. i.e. ServerConfig
for (let key in EnvConfig) {
  if (EnvConfig[key].ssl !== undefined && EnvConfig[key].address && EnvConfig[key].port) {
    EnvConfig[key].baseUrl = [EnvConfig[key].ssl ? 'https://' : 'http://', EnvConfig[key].address, (EnvConfig[key].port !== 80) ? ':' + EnvConfig[key].port : ''].join('');
  }
}

// set config for whether running in production
EnvConfig.production = production;

export { GLOBAL_CONFIG, GlobalConfig, EnvConfig }
