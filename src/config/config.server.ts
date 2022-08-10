import * as colors from 'colors';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

import { AppConfig } from './app-config.interface';
import { Config } from './config.interface';
import { DefaultAppConfig } from './default-app-config';
import { ServerConfig } from './server-config.interface';
import { mergeConfig } from './config.util';
import { isNotEmpty } from '../app/shared/empty.util';

const CONFIG_PATH = join(process.cwd(), 'config');

type Environment = 'production' | 'development' | 'test';

const DSPACE = (key: string): string => {
  return `DSPACE_${key}`;
};

const ENV = (key: string, prefix = false): any => {
  return prefix ? process.env[DSPACE(key)] : process.env[key];
};

const getBooleanFromString = (variable: string): boolean => {
  return variable === 'true' || variable === '1';
};

const getNumberFromString = (variable: string): number => {
  return Number(variable);
};

const getEnvironment = (): Environment => {
  // default to production
  let environment: Environment = 'production';
  if (isNotEmpty(ENV('NODE_ENV'))) {
    switch (ENV('NODE_ENV')) {
      case 'prod':
      case 'production':
        environment = 'production';
        break;
      case 'test':
        environment = 'test';
        break;
      case 'dev':
      case 'development':
        environment = 'development';
        break;
      default:
        console.warn(`Unknown NODE_ENV ${ENV('NODE_ENV')}. Defaulting to production.`);
    }
  }

  return environment;
};

const getLocalConfigPath = (env: Environment) => {
  // default to config/config.yml
  let localConfigPath = join(CONFIG_PATH, 'config.yml');

  if (!fs.existsSync(localConfigPath)) {
    localConfigPath = join(CONFIG_PATH, 'config.yaml');
  }

  // determine app config filename variations
  let envVariations;
  switch (env) {
    case 'production':
      envVariations = ['prod', 'production'];
      break;
    case 'test':
      envVariations = ['test'];
      break;
    case 'development':
    default:
      envVariations = ['dev', 'development'];
  }

  // check if any environment variations of app config exist
  for (const envVariation of envVariations) {
    let envLocalConfigPath = join(CONFIG_PATH, `config.${envVariation}.yml`);
    if (fs.existsSync(envLocalConfigPath)) {
      localConfigPath = envLocalConfigPath;
      break;
    } else {
      envLocalConfigPath = join(CONFIG_PATH, `config.${envVariation}.yaml`);
      if (fs.existsSync(envLocalConfigPath)) {
        localConfigPath = envLocalConfigPath;
        break;
      }
    }
  }

  return localConfigPath;
};

const overrideWithConfig = (config: Config, pathToConfig: string) => {
  try {
    console.log(`Overriding app config with ${pathToConfig}`);
    const externalConfig = fs.readFileSync(pathToConfig, 'utf8');
    mergeConfig(config, yaml.load(externalConfig));
  } catch (err) {
    console.error(err);
  }
};

const overrideWithEnvironment = (config: Config, key: string = '') => {
  // eslint-disable-next-line guard-for-in
  for (const property in config) {
    const variable = `${key}${isNotEmpty(key) ? '_' : ''}${property.toUpperCase()}`;
    const innerConfig = config[property];
    if (isNotEmpty(innerConfig)) {
      if (typeof innerConfig === 'object') {
        overrideWithEnvironment(innerConfig, variable);
      } else {
        const value = ENV(variable, true);
        if (isNotEmpty(value)) {
          console.log(`Applying environment variable ${DSPACE(variable)} with value ${value}`);
          switch (typeof innerConfig) {
            case 'number':
              config[property] = getNumberFromString(value);
              break;
            case 'boolean':
              config[property] = getBooleanFromString(value);
              break;
            case 'string':
              config[property] = value;
              break;
            default:
              console.warn(`Unsupported environment variable type ${typeof innerConfig} ${DSPACE(variable)}`);
          }
        }
      }
    }
  }
};



const buildBaseUrl = (config: ServerConfig): void => {
  config.baseUrl = [
    config.ssl ? 'https://' : 'http://',
    config.host,
    config.port && config.port !== 80 && config.port !== 443 ? `:${config.port}` : '',
    config.nameSpace && config.nameSpace.startsWith('/') ? config.nameSpace : `/${config.nameSpace}`
  ].join('');
};

/**
 * Build app config with the following chain of override.
 *
 * local config -> environment local config -> external config -> environment variable
 *
 * Optionally save to file.
 *
 * @param destConfigPath optional path to save config file
 * @returns app config
 */
export const buildAppConfig = (destConfigPath?: string): AppConfig => {
  // start with default app config
  const appConfig: AppConfig = new DefaultAppConfig();

  // determine which dist app config by environment
  const env = getEnvironment();

  switch (env) {
    case 'production':
      console.log(`Building ${colors.red.bold(`production`)} app config`);
      break;
    case 'test':
      console.log(`Building ${colors.blue.bold(`test`)} app config`);
      break;
    default:
      console.log(`Building ${colors.green.bold(`development`)} app config`);
  }

  // override with dist config
  const localConfigPath = getLocalConfigPath(env);
  if (fs.existsSync(localConfigPath)) {
    overrideWithConfig(appConfig, localConfigPath);
  } else {
    console.warn(`Unable to find dist config file at ${localConfigPath}`);
  }

  // override with external config if specified by environment variable `DSPACE_APP_CONFIG_PATH`
  const externalConfigPath = ENV('APP_CONFIG_PATH', true);
  if (isNotEmpty(externalConfigPath)) {
    if (fs.existsSync(externalConfigPath)) {
      overrideWithConfig(appConfig, externalConfigPath);
    } else {
      console.warn(`Unable to find external config file at ${externalConfigPath}`);
    }
  }

  // override with environment variables
  overrideWithEnvironment(appConfig);

  // apply existing non convention UI environment variables
  appConfig.ui.host = isNotEmpty(ENV('HOST', true)) ? ENV('HOST', true) : appConfig.ui.host;
  appConfig.ui.port = isNotEmpty(ENV('PORT', true)) ? getNumberFromString(ENV('PORT', true)) : appConfig.ui.port;
  appConfig.ui.nameSpace = isNotEmpty(ENV('NAMESPACE', true)) ? ENV('NAMESPACE', true) : appConfig.ui.nameSpace;
  appConfig.ui.ssl = isNotEmpty(ENV('SSL', true)) ? getBooleanFromString(ENV('SSL', true)) : appConfig.ui.ssl;

  // apply existing non convention REST environment variables
  appConfig.rest.host = isNotEmpty(ENV('REST_HOST', true)) ? ENV('REST_HOST', true) : appConfig.rest.host;
  appConfig.rest.port = isNotEmpty(ENV('REST_PORT', true)) ? getNumberFromString(ENV('REST_PORT', true)) : appConfig.rest.port;
  appConfig.rest.nameSpace = isNotEmpty(ENV('REST_NAMESPACE', true)) ? ENV('REST_NAMESPACE', true) : appConfig.rest.nameSpace;
  appConfig.rest.ssl = isNotEmpty(ENV('REST_SSL', true)) ? getBooleanFromString(ENV('REST_SSL', true)) : appConfig.rest.ssl;

  // apply build defined production
  appConfig.production = env === 'production';

  // build base URLs
  buildBaseUrl(appConfig.ui);
  buildBaseUrl(appConfig.rest);

  if (isNotEmpty(destConfigPath)) {
    fs.writeFileSync(destConfigPath, JSON.stringify(appConfig, null, 2));

    console.log(`Angular ${colors.bold('config.json')} file generated correctly at ${colors.bold(destConfigPath)} \n`);
  }

  return appConfig;
};
