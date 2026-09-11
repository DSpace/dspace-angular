import { isNotEmpty } from '@dspace/shared/utils/empty.util';

import { Config } from './config.interface';

type EnvConfigValueType = 'number' | 'boolean' | 'string';

type EnvConfigClientPartition = 'public' | 'server-only';

/**
 * Reads the string value for a named environment config override.
 */
export type EnvConfigValueGetter = (envName: string) => string;

/**
 * Describes an optional scalar config path that needs explicit environment override support.
 */
export interface SupplementalEnvConfigOverride {
  path: string[];
  type: EnvConfigValueType;
  clientPartition: EnvConfigClientPartition;
}

/**
 * Bounded supplemental map for optional scalar config leaves that cannot be discovered by the runtime walk when their
 * value is absent or empty in the merged config object. Future absent/empty optional scalar environment overrides
 * require an explicit entry here.
 */
export const SUPPLEMENTAL_ENV_CONFIG_OVERRIDES: SupplementalEnvConfigOverride[] = [
  // MatomoConfig.trackerUrl is optional, and DefaultAppConfig.matomo starts as an empty object.
  {
    path: ['matomo', 'trackerUrl'],
    type: 'string',
    clientPartition: 'public',
  },
  // ServerConfig.baseUrl is optional; if supplied by env, it must be applied before buildBaseUrl().
  {
    path: ['rest', 'baseUrl'],
    type: 'string',
    clientPartition: 'public',
  },
  // ServerConfig.ssrBaseUrl is optional and server-only; toClientConfig() strips it from client config.
  {
    path: ['rest', 'ssrBaseUrl'],
    type: 'string',
    clientPartition: 'server-only',
  },
];

/**
 * Builds the environment variable name for a config path.
 */
export const getEnvConfigName = (path: string[]): string => {
  return `DSPACE_${path.map((segment: string) => segment.toUpperCase()).join('_')}`;
};

const getBooleanFromString = (variable: string): boolean => {
  return variable === 'true' || variable === '1';
};

const getNumberFromString = (variable: string): number => {
  return Number(variable);
};

const applyEnvValueByPath = (
  config: Config,
  path: string[],
  type: string,
  getEnvValue: EnvConfigValueGetter,
): void => {
  const envName = getEnvConfigName(path);
  const value = getEnvValue(envName);

  if (isNotEmpty(value)) {
    const leaf = path[path.length - 1];
    let targetConfig = config;

    for (const pathSegment of path.slice(0, -1)) {
      if (targetConfig[pathSegment] === undefined || targetConfig[pathSegment] === null) {
        targetConfig[pathSegment] = {};
      } else if (typeof targetConfig[pathSegment] !== 'object') {
        console.warn(`Skipping environment variable ${envName}; non-object config parent at ${pathSegment}`);
        return;
      }
      targetConfig = targetConfig[pathSegment];
    }

    console.info(`Applying environment variable ${envName} with value ${value}`);
    switch (type) {
      case 'number':
        targetConfig[leaf] = getNumberFromString(value);
        break;
      case 'boolean':
        targetConfig[leaf] = getBooleanFromString(value);
        break;
      case 'string':
        targetConfig[leaf] = value;
        break;
      default:
        console.warn(`Unsupported environment variable type ${type} ${envName}`);
    }
  }
};

const applyRuntimeEnvironmentConfigOverrides = (
  rootConfig: Config,
  config: Config,
  getEnvValue: EnvConfigValueGetter,
  path: string[] = [],
): void => {
  Object.keys(config).forEach((property: string) => {
    const innerConfig = config[property];
    if (isNotEmpty(innerConfig)) {
      const innerPath = [...path, property];
      if (typeof innerConfig === 'object') {
        applyRuntimeEnvironmentConfigOverrides(rootConfig, innerConfig, getEnvValue, innerPath);
      } else {
        applyEnvValueByPath(rootConfig, innerPath, typeof innerConfig, getEnvValue);
      }
    }
  });
};

const getConfigValueByPath = (config: Config, path: string[]): any => {
  return path.reduce((currentConfig: any, pathSegment: string) => {
    if (typeof currentConfig === 'object' && currentConfig !== null) {
      return currentConfig[pathSegment];
    }
    return undefined;
  }, config);
};

const applySupplementalEnvironmentConfigOverrides = (
  config: Config,
  getEnvValue: EnvConfigValueGetter,
): void => {
  SUPPLEMENTAL_ENV_CONFIG_OVERRIDES.forEach((override: SupplementalEnvConfigOverride) => {
    if (!isNotEmpty(getConfigValueByPath(config, override.path))) {
      applyEnvValueByPath(config, override.path, override.type, getEnvValue);
    }
  });
};

/**
 * Applies runtime and supplemental environment overrides to the provided config object.
 */
export const applyEnvironmentConfigOverrides = (
  config: Config,
  getEnvValue: EnvConfigValueGetter,
): void => {
  applyRuntimeEnvironmentConfigOverrides(config, config, getEnvValue);
  applySupplementalEnvironmentConfigOverrides(config, getEnvValue);
};
