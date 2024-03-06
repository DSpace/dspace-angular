import { NavigationBreadcrumbResolver } from './navigation-breadcrumb.resolver';

describe('NavigationBreadcrumbResolver', () => {
  describe('resolve', () => {
    let resolver: NavigationBreadcrumbResolver;
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
              data: {breadcrumbKey: relatedI18nKey},
            }
          ]
        },
        routeConfig: {
          path: 'example'
        },
        parent: {
          routeConfig: {
            path: ''
          },
          url: [{
            path: 'base'
          }]
        } as any
      };

      state = {
        url: '/base/example'
      };
      expectedPath = '/base/example:/base';
      NavigationBreadcrumbService = {};
      resolver = new NavigationBreadcrumbResolver(NavigationBreadcrumbService);
    });

    it('should resolve the breadcrumb config', () => {
      const resolvedConfig = resolver.resolve(route, state);
      const expectedConfig = { provider: NavigationBreadcrumbService, key: `${i18nKey}:${relatedI18nKey}`, url: expectedPath };
      expect(resolvedConfig).toEqual(expectedConfig);
    });
  });
});
