import { navigationBreadcrumbResolver } from './navigation-breadcrumb.resolver';

describe('navigationBreadcrumbResolver', () => {
  describe('resolve', () => {
    let resolver: any;
    let NavigationBreadcrumbService: any;
    let i18nKey: string;
    let relatedI18nKey: string;
    let route: any;
    let expectedPath;
    let state;
    beforeEach(() => {
      i18nKey = 'example.key';
      relatedI18nKey = 'related.key';
      route = {
        data: {
          breadcrumbKey: i18nKey,
          relatedRoutes: [
            {
              path: '',
              data: { breadcrumbKey: relatedI18nKey },
            },
          ],
        },
        routeConfig: {
          path: 'example',
        },
        parent: {
          routeConfig: {
            path: '',
          },
          url: [{
            path: 'base',
          }],
        } as any,
      };

      state = {
        url: '/base/example',
      };
      expectedPath = '/base/example:/base';
      NavigationBreadcrumbService = {};
      resolver = navigationBreadcrumbResolver;
    });

    it('should resolve the breadcrumb config', () => {
      const resolvedConfig = resolver(route, state, NavigationBreadcrumbService);
      const expectedConfig = { provider: NavigationBreadcrumbService, key: `${i18nKey}:${relatedI18nKey}`, url: expectedPath };
      expect(resolvedConfig).toEqual(expectedConfig);
    });
  });
});
