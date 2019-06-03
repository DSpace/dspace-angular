// Look in ./config folder for config
import { InjectionToken } from '@angular/core';
import { hasValue } from './app/shared/empty.util';
var GLOBAL_CONFIG = new InjectionToken('config');
var configContext = require.context('../config', false, /js$/);
var production = false;
var ENV_CONFIG;
var envConfigOverride;
var envConfigFile;
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
    ENV_CONFIG = configContext('./environment.default.js');
}
catch (e) {
    throw new Error('Cannot find file config/environment.default.js');
}
// if envConfigFile set try to get configs
if (envConfigFile) {
    try {
        envConfigOverride = configContext(envConfigFile);
    }
    catch (e) {
        console.warn('Cannot find file ' + envConfigFile.substring(2, envConfigFile.length), 'Using default environment');
    }
    try {
        merge(envConfigOverride);
    }
    catch (e) {
        console.warn('Unable to merge the default environment');
    }
}
// allow to override a few important options by environment variables
function createServerConfig(host, port, nameSpace, ssl) {
    var result = { host: host, nameSpace: nameSpace };
    if (hasValue(port)) {
        result.port = Number(port);
    }
    if (hasValue(ssl)) {
        result.ssl = ssl.trim().match(/^(true|1|yes)$/i) ? true : false;
    }
    return result;
}
var processEnv = {
    ui: createServerConfig(process.env.DSPACE_HOST, process.env.DSPACE_PORT, process.env.DSPACE_NAMESPACE, process.env.DSPACE_SSL),
    rest: createServerConfig(process.env.DSPACE_REST_HOST, process.env.DSPACE_REST_PORT, process.env.DSPACE_REST_NAMESPACE, process.env.DSPACE_REST_SSL)
};
// merge the environment variables with our configuration.
try {
    merge(processEnv);
}
catch (e) {
    console.warn('Unable to merge environment variable into the configuration');
}
buildBaseUrls();
// set config for whether running in production
ENV_CONFIG.production = production;
function merge(config) {
    innerMerge(ENV_CONFIG, config);
}
function innerMerge(globalConfig, config) {
    for (var key in config) {
        if (config.hasOwnProperty(key)) {
            if (isObject(config[key])) {
                innerMerge(globalConfig[key], config[key]);
            }
            else {
                if (isDefined(config[key])) {
                    globalConfig[key] = config[key];
                }
            }
        }
    }
}
function buildBaseUrls() {
    for (var key in ENV_CONFIG) {
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
function getProtocol(ssl) {
    return ssl ? 'https://' : 'http://';
}
function getHost(host) {
    return host;
}
function getPort(port) {
    return port ? (port !== 80 && port !== 443) ? ':' + port : '' : '';
}
function getNameSpace(nameSpace) {
    return nameSpace ? nameSpace.charAt(0) === '/' ? nameSpace : '/' + nameSpace : '';
}
function isDefined(value) {
    return typeof value !== 'undefined' && value !== null;
}
function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}
export { GLOBAL_CONFIG, ENV_CONFIG };
//# sourceMappingURL=config.js.map