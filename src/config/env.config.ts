import {
  existsSync,
  PathLike,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

import {
  isEmpty,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import {
  blue,
  green,
  red,
} from 'colors';
import { load } from 'js-yaml';

import { AppConfig } from './app.config';

const CONFIG_PATH = join(process.cwd(), 'config');

const readConfig = (file: PathLike) => load(
  readFileSync(file, 'utf-8'),
);

const readDefaultConfig = (): Partial<AppConfig> | void => {
  const conf = join(CONFIG_PATH, 'config.yml');

  if (existsSync(conf)) {
    console.log(`Loading config file ${blue.bold(conf)}.`);
    return readConfig(conf) as Partial<AppConfig>;
  }
};

const nodeEnv = (): 'production' | 'development' | 'test' => {
  let env = process.env.NODE_ENV;

  if (isEmpty(env)) {
    // default to production
    env = 'production';
  }

  switch (env) {
    case 'prod':
    case 'production':
      console.log(`Building ${red.bold(`production`)} app config`);
      return 'production';
    case 'test':
      console.log(`Building ${blue.bold(`test`)} app config`);
      return 'test';
    case 'dev':
    case 'development':
      console.log(`Building ${green.bold(`development`)} app config`);
      return 'development';
  }

  console.warn(`Unknown NODE_ENV ${env}. Defaulting to production.`);
  return 'production';
};

const readEnvConfig = (): Partial<AppConfig> | void => {
  let variations: string[];

  switch (nodeEnv()) {
    case 'production':
      variations = ['prod', 'production'];
      break;
    case 'test':
      variations = ['test'];
      break;
    case 'development':
    default:
      variations = ['dev', 'development'];
  }

  for (const v of variations) {
    for (const p of [
      join(CONFIG_PATH, `config.${v}.yml`),
      join(CONFIG_PATH, `config.${v}.yaml`),
    ]) {
      if (existsSync(p)) {
        console.log(`Loading env config file ${blue.bold(p)}.`);
        return readConfig(p) as AppConfig;
      }
    }
  }
};

const readExternalConfig = (): Partial<AppConfig> | void => {
  const conf = process.env.DSPACE_APP_CONFIG_PATH;
  if (isNotEmpty(conf)) {
    if (existsSync(conf)) {
      console.log(`Loading external config file ${blue.bold(conf)}.`);
      return readConfig(conf) as Partial<AppConfig>;
    }

    console.warn(`Unable to find external config file at ${conf}`);
  }
};

/**
 * Load environment variables and local configs into an AppConfig
 *
 * @param config The config to modify with the environment
 * @returns void The config is modified in-place.
 */
export const loadEnvInto = (config: AppConfig) => {
  // override with default config
  const defaultConf = readDefaultConfig();
  if (defaultConf) {
    config.apply(defaultConf);
  }

  // override with env config
  const envConf = readEnvConfig();
  if (envConf) {
    config.apply(envConf);
  }

  // override with external config if specified by environment
  // variable `DSPACE_APP_CONFIG_PATH`
  const externalConf = readExternalConfig();
  if (externalConf) {
    config.apply(externalConf);
  }

  // Load environment variables
  config.applyEnvironment(process.env);
};

/**
 * Write public config properties to a file.
 *
 * By default, only properties marked with @Config.public will be
 * written.
 *
 * @param config The config to serialize
 * @param file Path to the output file
 * @param includePrivate Whether to include all properties, whether or
 *   not they were marked as public.
 */
export const writeConfig = (config: AppConfig, file: PathLike) => {
  writeFileSync(
    file,
    JSON.stringify(config.toPublic(), null, 2));
};
