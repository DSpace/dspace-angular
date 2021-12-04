import * as colors from 'colors';
import * as fs from 'fs';
import { join } from 'path';
import { AppConfig } from './app-config.interface';
import { Config } from './config.interface';
import { DefaultAppConfig } from './default-app-config';
import { ServerConfig } from './server-config.interface';

const CONFIG_PATH = join(process.cwd(), 'config');

const APP_CONFIG_PATH = join(CONFIG_PATH, 'appConfig.json');

type Environment = 'production' | 'development' | 'test';

const getEnvironment = (): Environment => {
  let environment: Environment = 'development';
  if (!!process.env.NODE_ENV) {
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

const getDistConfigPath = (env: Environment) => {
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
    const altDistConfigPath = join(CONFIG_PATH, `appConfig.${envVariation}.json`);
    if (fs.existsSync(altDistConfigPath)) {
      return altDistConfigPath;
    }
  }

  // return default config/appConfig.json
  return APP_CONFIG_PATH;
};

const overrideWithConfig = (config: Config, pathToConfig: string) => {
  try {
    console.log(`Overriding app config with ${pathToConfig}`);
    const externalConfig = fs.readFileSync(pathToConfig, 'utf8');
    Object.assign(config, JSON.parse(externalConfig));
  } catch (err) {
    console.error(err);
  }
};

const overrideWithEnvironment = (config: Config, key: string = '') => {
  for (const property in config) {
    const variable = `${key}${!!key ? '_' : ''}${property.toUpperCase()}`;
    const innerConfig = config[property];
    if (!!innerConfig) {
      if (typeof innerConfig === 'object') {
        overrideWithEnvironment(innerConfig, variable);
      } else {
        if (!!process.env[variable]) {
          console.log(`Applying environment variable ${variable} with value ${process.env[variable]}`);
          config[property] = process.env[variable];
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

export const buildAppConfig = (destConfigPath: string): AppConfig => {
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
  const distConfigPath = getDistConfigPath(env);
  if (fs.existsSync(distConfigPath)) {
    overrideWithConfig(appConfig, distConfigPath);
  } else {
    console.warn(`Unable to find dist config file at ${distConfigPath}`);
  }

  // override with external config if specified by environment variable `APP_CONFIG_PATH`
  const externalConfigPath = process.env.APP_CONFIG_PATH;
  if (!!externalConfigPath) {
    if (fs.existsSync(externalConfigPath)) {
      overrideWithConfig(appConfig, externalConfigPath);
    } else {
      console.warn(`Unable to find external config file at ${externalConfigPath}`);
    }
  }

  // override with environment variables
  overrideWithEnvironment(appConfig);

  // apply build defined production
  appConfig.production = env === 'production';

  // build base URLs
  buildBaseUrl(appConfig.ui);
  buildBaseUrl(appConfig.rest);

  fs.writeFileSync(destConfigPath, JSON.stringify(appConfig, null, 2));

  console.log(`Angular ${colors.bold('appConfig.json')} file generated correctly at ${colors.bold(destConfigPath)} \n`);

  return appConfig;
}
