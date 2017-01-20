// Look in ./config folder for config

const path = require('path');

let configContext = require.context("../config", false, /json$/);
let EnvConfig : any = {};
let EnvConfigFile : string;
let CommonConfig : any = {};

try {
    CommonConfig = configContext('./environment.common.json');
} catch (e) {
    throw new Error(`Cannot find file "${path.resolve('config', './environment.common.json')}"`);
}

switch (process.env.NODE_ENV) {
    case 'prod':
    case 'production':
        EnvConfigFile = './environment.prod.json';
        break;
    case 'dev':
    case 'development':
    default:
        EnvConfigFile = './environment.dev.json';
}
try {
    EnvConfig = configContext(EnvConfigFile);
} catch (e) {
    throw new Error(`Cannot find file "${path.resolve('config', EnvConfigFile)}"`);
}

const GlobalConfig = Object.assign(CommonConfig, EnvConfig);

export {GlobalConfig}
