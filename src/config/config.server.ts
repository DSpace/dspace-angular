import * as colors from 'colors';
import * as fs from 'fs';
import { join } from 'path';

import { AppConfig } from './app-config.interface';
import { Config } from './config.interface';
import { DefaultAppConfig } from './default-app-config';
import { ServerConfig } from './server-config.interface';
import { mergeConfig } from './config.util';
import { isNotEmpty } from '../app/shared/empty.util';

const CONFIG_PATH = join(process.cwd(), 'config');

type Environment = 'production' | 'development' | 'test';

const getBooleanFromString = (variable: string): boolean => {
  return variable === 'true' || variable === '1';
};

const getNumberFromString = (variable: string): number => {
  return Number(variable);
};

const getEnvironment = (): Environment => {
  let environment: Environment = 'development';
  if (isNotEmpty(process.env.NODE_ENV)) {
    switch (process.env.NODE_ENV) {
      case 'prod':
      case 'production':
        environment = 'production';
        break;
      case 'test':
        environment = 'test';
        break;
      case 'dev':
      case 'development':
        break;
      default:
        console.warn(`Unknown NODE_ENV ${process.env.NODE_ENV}. Defaulting to development`);
    }
  }

  return environment;
};

const getLocalConfigPath = (env: Environment) => {
  // default to config/appConfig.json
  let localConfigPath = join(CONFIG_PATH, 'appConfig.json');

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
      envVariations = ['dev', 'development']
  }

  // check if any environment variations of app config exist
  for (const envVariation of envVariations) {
    const envLocalConfigPath = join(CONFIG_PATH, `appConfig.${envVariation}.json`);
    if (fs.existsSync(envLocalConfigPath)) {
      localConfigPath = envLocalConfigPath;
    }
  }

  return localConfigPath;
};

const overrideWithConfig = (config: Config, pathToConfig: string) => {
  try {
    console.log(`Overriding app config with ${pathToConfig}`);
    const externalConfig = fs.readFileSync(pathToConfig, 'utf8');
    mergeConfig(config, JSON.parse(externalConfig));
  } catch (err) {
    console.error(err);
  }
};

const overrideWithEnvironment = (config: Config, key: string = '') => {
  for (const property in config) {
    const variable = `${key}${isNotEmpty(key) ? '_' : ''}${property.toUpperCase()}`;
    const innerConfig = config[property];
    if (isNotEmpty(innerConfig)) {
      if (typeof innerConfig === 'object') {
        overrideWithEnvironment(innerConfig, variable);
      } else {
        if (isNotEmpty(process.env[variable])) {
          console.log(`Applying environment variable ${variable} with value ${process.env[variable]}`);
          switch (typeof innerConfig) {
            case 'number':
              config[property] = getNumberFromString(process.env[variable]);
              break;
            case 'boolean':
              config[property] = getBooleanFromString(process.env[variable]);
              break;
            case 'string':
              config[property] = process.env[variable];
            default:
              console.warn(`Unsupported environment variable type ${typeof innerConfig} ${variable}`);
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

  // override with external config if specified by environment variable `APP_CONFIG_PATH`
  const externalConfigPath = process.env.APP_CONFIG_PATH;
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
  appConfig.ui.host = isNotEmpty(process.env.DSPACE_HOST) ? process.env.DSPACE_HOST : appConfig.ui.host;
  appConfig.ui.port = isNotEmpty(process.env.DSPACE_PORT) ? getNumberFromString(process.env.DSPACE_PORT) : appConfig.ui.port;
  appConfig.ui.nameSpace = isNotEmpty(process.env.DSPACE_NAMESPACE) ? process.env.DSPACE_NAMESPACE : appConfig.ui.nameSpace;
  appConfig.ui.ssl = isNotEmpty(process.env.DSPACE_SSL) ? getBooleanFromString(process.env.DSPACE_SSL) : appConfig.ui.ssl;

  // apply existing non convention REST environment variables
  appConfig.rest.host = isNotEmpty(process.env.DSPACE_REST_HOST) ? process.env.DSPACE_REST_HOST : appConfig.rest.host;
  appConfig.rest.port = isNotEmpty(process.env.DSPACE_REST_PORT) ? getNumberFromString(process.env.DSPACE_REST_PORT) : appConfig.rest.port;
  appConfig.rest.nameSpace = isNotEmpty(process.env.DSPACE_REST_NAMESPACE) ? process.env.DSPACE_REST_NAMESPACE : appConfig.rest.nameSpace;
  appConfig.rest.ssl = isNotEmpty(process.env.DSPACE_REST_SSL) ? getBooleanFromString(process.env.DSPACE_REST_SSL) : appConfig.rest.ssl;

  // apply build defined production
  appConfig.production = env === 'production';

  // build base URLs
  buildBaseUrl(appConfig.ui);
  buildBaseUrl(appConfig.rest);

  if (isNotEmpty(destConfigPath)) {
    fs.writeFileSync(destConfigPath, JSON.stringify(appConfig, null, 2));

    console.log(`Angular ${colors.bold('appConfig.json')} file generated correctly at ${colors.bold(destConfigPath)} \n`);
  }

  return appConfig;
};
