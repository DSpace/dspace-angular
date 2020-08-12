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
    console.log(`Building ${colors.red.bold(`production`)} environment`);
    environmentFilePath = '../src/environments/environment.prod.ts';
    break;
  case '--test':
    console.log(`Building ${colors.blue.bold(`test`)} environment`);
    environmentFilePath = '../src/environments/environment.test.ts';
    break;
  default:
    console.log(`Building ${colors.green.bold(`development`)} environment`);
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
  .then((file) => generateEnvironmentFile(merge.all([commonEnv, file.environment, processEnv])))
  .catch(() => {
    console.log(colors.yellow.bold(`No specific environment file found for ` + environment));
    generateEnvironmentFile(merge(commonEnv, processEnv))
  });

function generateEnvironmentFile(file: GlobalConfig): void {
  file.production = production;
  buildBaseUrls(file);

  // TODO remove workaround in beta 5
  if (file.rest.nameSpace.match("(.*)/api/?$") !== null) {
    const newValue = getNameSpace(file.rest.nameSpace);
    console.log(colors.white.bgMagenta.bold(`The rest.nameSpace property in your environment file or in your DSPACE_REST_NAMESPACE environment variable ends with '/api'.\nThis is deprecated. As '/api' isn't configurable on the rest side, it shouldn't be repeated in every environment file.\nPlease change the rest nameSpace to '${newValue}'`));
  }

  const contents = `export const environment = ` + JSON.stringify(file);
  writeFile(targetPath, contents, (err) => {
    if (err) {
      throw console.error(err);
    } else {
      console.log(`Angular ${colors.bold('environment.ts')} file generated correctly at ${colors.bold(targetPath)} \n`);
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
    result.nameSpace = nameSpace;
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
  // TODO remove workaround in beta 5
  const apiMatches = nameSpace.match("(.*)/api/?$");
  if (apiMatches != null) {
    let newValue = '/'
    if (hasValue(apiMatches[1])) {
      newValue = apiMatches[1];
    }
    return newValue;
  }
  else {
    return nameSpace ? nameSpace.charAt(0) === '/' ? nameSpace : '/' + nameSpace : '';
  }
}
