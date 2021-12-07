import { environment } from '../environments/environment.prod';
import { extendEnvironmentWithAppConfig } from './config.util';
import { DefaultAppConfig } from './default-app-config';

describe('Config Util', () => {
  describe('extendEnvironmentWithAppConfig', () => {
    it('should extend prod environment with app config', () => {
      const appConfig = new DefaultAppConfig();
      const originalMsToLive = appConfig.cache.msToLive.default;
      expect(originalMsToLive).toEqual(15 * 60 * 1000); // 15 minute
      const msToLive = 1 * 60 * 1000; // 1 minute
      appConfig.cache.msToLive.default = msToLive;
      extendEnvironmentWithAppConfig(environment, appConfig);
      expect(environment.cache.msToLive.default).toEqual(msToLive);
    });
  });
});
