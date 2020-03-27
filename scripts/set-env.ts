import { writeFile } from 'fs';
import { environment as commonEnv } from '../src/environments/environment.common';
import { GlobalConfig } from '../src/config/global-config.interface';
import { ServerConfig } from '../src/config/server-config.interface';
import { hasValue } from '../src/app/shared/empty.util';

// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts';
// Load node modules
const colors = require('colors');
require('dotenv').config();
const merge = require('deepmerge');

const environment = process.argv[2];
let environmentFilePath;
let production = false;

switch (environment) {
  case '--prod':
  case '--production':
    production = true;
    environmentFilePath = '../src/environments/environment.prod.ts';
    break;
  case '--test':
    environmentFilePath = '../src/environments/environment.test.ts';
    break;
  default:
    environmentFilePath = '../src/environments/environment.dev.ts';
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
} as GlobalConfig;

import(environmentFilePath)
  .then((file) => generateEnvironmentFile(merge.all(commonEnv, file.environment, processEnv)))
  .catch(() => generateEnvironmentFile(merge(commonEnv, processEnv)));

function generateEnvironmentFile(file: GlobalConfig): void {
  file.production = production;
  buildBaseUrls(file);
  const contents = `export const environment = ` + JSON.stringify(file);
  console.log(colors.magenta('The file `environment.ts` will be written with the following content: \n'));
  console.log(colors.grey(contents));
  writeFile(targetPath, contents, (err) => {
    if (err) {
      throw console.error(err);
    } else {
      console.log(colors.magenta(`Angular environment.ts file generated correctly at ${targetPath} \n`));
    }
  });
}

// allow to override a few important options by environment variables
function createServerConfig(host?: string,  port?: string, nameSpace?: string, ssl?: string): ServerConfig {
  const result = {} as any;
  if (hasValue(host)) {
    result.host = host;
  }

  if (hasValue(nameSpace)) {
    result.host = nameSpace;
  }

  if (hasValue(port)) {
    result.port = Number(port);
  }

  if (hasValue(ssl)) {
    result.ssl = ssl.trim().match(/^(true|1|yes)$/i) ? true : false;
  }

  return result;
}

function buildBaseUrls(config: GlobalConfig): void {
  for (const key in config) {
    if (config.hasOwnProperty(key) && config[key].host) {
      console.log(key);
      console.log(config[key]);
      config[key].baseUrl = [
        getProtocol(config[key].ssl),
        getHost(config[key].host),
        getPort(config[key].port),
        getNameSpace(config[key].nameSpace)
      ].join('');
    }
  }
}

function getProtocol(ssl: boolean): string {
  return ssl ? 'https://' : 'http://';
}

function getHost(host: string): string {
  return host;
}

function getPort(port: number): string {
  return port ? (port !== 80 && port !== 443) ? ':' + port : '' : '';
}

function getNameSpace(nameSpace: string): string {
  return nameSpace ? nameSpace.charAt(0) === '/' ? nameSpace : '/' + nameSpace : '';
}
