import {
  AppConfig,
  toClientConfig,
} from './app-config.interface';
import { DefaultAppConfig } from './default-app-config';
import {
  applyEnvironmentConfigOverrides,
  getEnvConfigName,
  SUPPLEMENTAL_ENV_CONFIG_OVERRIDES,
} from './env-config-overrides';

describe('Environment config overrides', () => {
  const applyOverrides = (appConfig: AppConfig, env: { [key: string]: string }): void => {
    applyEnvironmentConfigOverrides(appConfig, (envName: string) => env[envName]);
  };

  const getConfigValueByPath = (config: any, path: string[]): any => {
    return path.reduce((currentConfig: any, pathSegment: string) => {
      if (typeof currentConfig === 'object' && currentConfig !== null) {
        return currentConfig[pathSegment];
      }
      return undefined;
    }, config);
  };

  const getEnvValueForSupplementalOverride = (type: string): string => {
    switch (type) {
      case 'number':
        return '100';
      case 'boolean':
        return 'true';
      default:
        return 'supplemental-override';
    }
  };

  beforeEach(() => {
    spyOn(console, 'info');
    spyOn(console, 'warn');
  });

  it('should derive environment variable names from config paths', () => {
    expect(getEnvConfigName(['matomo', 'trackerUrl'])).toEqual('DSPACE_MATOMO_TRACKERURL');
    expect(getEnvConfigName(['rest', 'ssrBaseUrl'])).toEqual('DSPACE_REST_SSRBASEURL');
    expect(getEnvConfigName(['cache', 'msToLive', 'default'])).toEqual('DSPACE_CACHE_MSTOLIVE_DEFAULT');
    expect(getEnvConfigName(['info', 'enableCookieConsentPopup'])).toEqual('DSPACE_INFO_ENABLECOOKIECONSENTPOPUP');
  });

  it('should set absent optional scalar leaves from the supplemental map', () => {
    const appConfig = new DefaultAppConfig();

    applyOverrides(appConfig, {
      DSPACE_MATOMO_TRACKERURL: 'https://analytics.example.org/matomo.php',
      DSPACE_REST_BASEURL: 'https://api.example.org/server',
      DSPACE_REST_SSRBASEURL: 'http://internal-rest:8080/server',
    });

    expect(appConfig.matomo.trackerUrl).toEqual('https://analytics.example.org/matomo.php');
    expect(appConfig.rest.baseUrl).toEqual('https://api.example.org/server');
    expect(appConfig.rest.ssrBaseUrl).toEqual('http://internal-rest:8080/server');
  });

  it('should override empty optional scalar leaves from the supplemental map', () => {
    const appConfig = new DefaultAppConfig();
    appConfig.matomo.trackerUrl = '';

    applyOverrides(appConfig, {
      DSPACE_MATOMO_TRACKERURL: 'https://analytics.example.org/matomo.php',
    });

    expect(appConfig.matomo.trackerUrl).toEqual('https://analytics.example.org/matomo.php');
  });

  it('should preserve populated scalar conversion behavior', () => {
    const appConfig = new DefaultAppConfig();

    applyOverrides(appConfig, {
      DSPACE_CACHE_MSTOLIVE_DEFAULT: '12345',
      DSPACE_INFO_ENABLECOOKIECONSENTPOPUP: 'false',
      DSPACE_MARKDOWN_ENABLED: '1',
      DSPACE_FALLBACKLANGUAGE: 'de',
    });

    expect(appConfig.cache.msToLive.default).toEqual(12345);
    expect(appConfig.info.enableCookieConsentPopup).toBeFalse();
    expect(appConfig.markdown.enabled).toBeTrue();
    expect(appConfig.fallbackLanguage).toEqual('de');
  });

  it('should keep empty environment values as non-overrides', () => {
    const appConfig = new DefaultAppConfig();

    applyOverrides(appConfig, {
      DSPACE_FALLBACKLANGUAGE: '',
      DSPACE_MATOMO_TRACKERURL: '',
    });

    expect(appConfig.fallbackLanguage).not.toEqual('');
    expect(appConfig.matomo.trackerUrl).toBeUndefined();
  });

  it('should not clobber existing non-object parents for supplemental override paths', () => {
    const appConfig = new DefaultAppConfig();
    const supplementalOverride = {
      path: ['fallbackLanguage', 'code'],
      type: 'string' as const,
      clientPartition: 'public' as const,
    };

    SUPPLEMENTAL_ENV_CONFIG_OVERRIDES.push(supplementalOverride);

    try {
      applyOverrides(appConfig, {
        DSPACE_FALLBACKLANGUAGE_CODE: 'de',
      });

      expect(appConfig.fallbackLanguage).toEqual(new DefaultAppConfig().fallbackLanguage);
      expect((appConfig.fallbackLanguage as any).code).toBeUndefined();
    } finally {
      SUPPLEMENTAL_ENV_CONFIG_OVERRIDES.splice(SUPPLEMENTAL_ENV_CONFIG_OVERRIDES.indexOf(supplementalOverride), 1);
    }
  });

  it('should strip server-only values from direct TransferState and generated client config output', () => {
    const appConfig = new DefaultAppConfig();
    const serverOnlySupplementalOverrides = SUPPLEMENTAL_ENV_CONFIG_OVERRIDES.filter((entry) => {
      return entry.clientPartition === 'server-only';
    });

    const serverOnlyEnv = serverOnlySupplementalOverrides.reduce((env, entry) => {
      env[getEnvConfigName(entry.path)] = getEnvValueForSupplementalOverride(entry.type);
      return env;
    }, {});

    applyOverrides(appConfig, {
      ...serverOnlyEnv,
      DSPACE_REST_SSRBASEURL: 'http://internal-rest:8080/server',
      DSPACE_CACHE_SERVERSIDE_DEBUG: 'true',
      DSPACE_UI_RATELIMITER_LIMIT: '100',
      DSPACE_UI_USEPROXIES: 'false',
    });
    appConfig.rest.hasSsrBaseUrl = true;

    const transferStateClientConfig = toClientConfig(appConfig) as AppConfig;
    const generatedClientConfig = JSON.parse(JSON.stringify(toClientConfig(appConfig))) as AppConfig;

    expect(serverOnlySupplementalOverrides.length).toBeGreaterThan(0);
    serverOnlySupplementalOverrides.forEach((entry) => {
      expect(getConfigValueByPath(transferStateClientConfig, entry.path)).toBeUndefined();
      expect(getConfigValueByPath(generatedClientConfig, entry.path)).toBeUndefined();
    });
    expect(transferStateClientConfig.rest.ssrBaseUrl).toBeUndefined();
    expect(transferStateClientConfig.rest.hasSsrBaseUrl).toBeUndefined();
    expect(transferStateClientConfig.cache.serverSide).toBeUndefined();
    expect(transferStateClientConfig.ui.rateLimiter).toBeUndefined();
    expect(transferStateClientConfig.ui.useProxies).toBeUndefined();
    expect(generatedClientConfig.rest.ssrBaseUrl).toBeUndefined();
    expect(generatedClientConfig.rest.hasSsrBaseUrl).toBeUndefined();
    expect(generatedClientConfig.cache.serverSide).toBeUndefined();
    expect(generatedClientConfig.ui.rateLimiter).toBeUndefined();
    expect(generatedClientConfig.ui.useProxies).toBeUndefined();
  });
});
