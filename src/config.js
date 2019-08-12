const path = require('path');

let production = false;

let mergedConfig;

let envConfigOverride;

let envConfigFile;

__webpack

// check process.env.NODE_ENV to determine which environment config to use
// process.env.NODE_ENV is defined by webpack, else assume development
switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    // webpack.prod.dspace-angular-config.ts defines process.env.NODE_ENV = 'production'
    envConfigFile = './environment.prod.js';
    production = true;
    break;
  case 'test':
    // webpack.test.dspace-angular-config.ts defines process.env.NODE_ENV = 'test'
    envConfigFile = './environment.test.js';
    break;
  default:
    // if not using webpack.prod.dspace-angular-config.ts or webpack.test.dspace-angular-config.ts, it must be development
    envConfigFile = './environment.dev.js';
}

try {
  mergedConfig = require(path.resolve(__dirname, '..', 'config', 'environment.default.js'));
} catch (e) {
  console.log('e', e);
  throw new Error('Cannot find file config/environment.default.js');
}

// if envConfigFile set try to get configs
if (envConfigFile) {
  try {
    envConfigOverride = require(path.resolve(__dirname, '..', 'config', envConfigFile));
  } catch (e) {
    console.log('e', e);
    console.warn('Cannot find file ' + envConfigFile.substring(2, envConfigFile.length), 'Using default environment');
  }
  try {
    merge(envConfigOverride);
  } catch (e) {
    console.warn('Unable to merge the default environment');
  }
}

// allow to override a few important options by environment variables
function createServerConfig(host,  port, nameSpace, ssl) {
  const result = { host, nameSpace };

  if (port !== null && port !== undefined) {
    result.port = port * 1;
  }

  if (ssl !== null && ssl !== undefined) {
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
};

// merge the environment variables with our configuration.
try {
  merge(processEnv)
} catch (e) {
  console.warn('Unable to merge environment variable into the configuration')
}

buildBaseUrls();

// set config for whether running in production
mergedConfig.production = production;

function merge(config) {
  innerMerge(mergedConfig, config);
}

function innerMerge(globalConfig, config) {
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

function buildBaseUrls() {
  for (const key in mergedConfig) {
    if (mergedConfig.hasOwnProperty(key) && mergedConfig[key].host) {
      mergedConfig[key].baseUrl = [
        getProtocol(mergedConfig[key].ssl),
        getHost(mergedConfig[key].host),
        getPort(mergedConfig[key].port),
        getNameSpace(mergedConfig[key].nameSpace)
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

module.exports = {
  mergedConfig: mergedConfig
};
