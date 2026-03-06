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

import { Config } from './config';
import { DefaultAppConfig } from './default-app.config';

const CONFIG_PATH = join(process.cwd(), 'config');

type Environment = 'production' | 'development' | 'test';

const readConfig = (file: PathLike) => load(
  readFileSync(file, 'utf-8'),
);

export class EnvAppConfig extends DefaultAppConfig {
  /**
   * Load environment variables into the default app config.
   *
   * @return an AppConfig with default values overwritten by local
   *   config files and environment variables.
   */
  static loadEnv(): EnvAppConfig {
    const conf = Config.assign(EnvAppConfig, {});
    conf.loadFromEnvironment();
    return conf;
  }

  /**
   * Write a config's public properties to a file
   *
   * Config properties not marked with '@Config.publish()` will not be
   * included.
   *
   * @param file the file to write to
   */
  write(file: PathLike) {
    writeFileSync(file, JSON.stringify(this.toPublic(), null, 2));
  }

  private loadFromEnvironment() {
    // override with default config
    const defaultConf = this.readDefaultConfig();
    if (defaultConf) {
      this.apply(defaultConf);
    }

    // override with env config
    const envConf = this.readEnvConfig();
    if (envConf) {
      this.apply(envConf);
    }

    // override with external config if specified by environment
    // variable `DSPACE_APP_CONFIG_PATH`
    const externalConf = this.readExternalConfig();
    if (externalConf) {
      this.apply(externalConf);
    }

    // Load environment variables
    this.applyEnvironment(process.env);
  }

  private get nodeEnv(): Environment {
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
  }

  private readDefaultConfig(): Partial<EnvAppConfig> | void {
    const conf = join(CONFIG_PATH, 'config.yml');

    if (existsSync(conf)) {
      return readConfig(conf) as Partial<EnvAppConfig>;
    }
  }

  private readEnvConfig(): Partial<EnvAppConfig> | void {
    let variations: string[];

    switch (this.nodeEnv) {
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
      const paths = [
        join(CONFIG_PATH, `config.${v}.yml`),
        join(CONFIG_PATH, `config.${v}.yaml`),
      ];

      for (const p of paths) {
        if (existsSync(p)) {
          return readConfig(p) as EnvAppConfig;
        }
      }
    }
  }

  private readExternalConfig(): Partial<EnvAppConfig> | void {
    const conf = process.env.DSPACE_APP_CONFIG_PATH;
    if (isNotEmpty(conf)) {
      if (existsSync(conf)) {
        return readConfig(conf) as Partial<EnvAppConfig>;
      }

      console.warn(`Unable to find external config file at ${conf}`);
    }
  }
}
