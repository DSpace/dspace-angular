// Look in ./config folder for config

const path = require('path');

let configContext = require.context("../config", false, /js$/);
let EnvConfig : any = {};
let EnvConfigFile : string;
let DefaultConfig : any = {};

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

const GlobalConfig = Object.assign(DefaultConfig, EnvConfig);

export {GlobalConfig}
