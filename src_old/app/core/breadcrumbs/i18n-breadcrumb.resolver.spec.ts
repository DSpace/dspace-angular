import { URLCombiner } from '../url-combiner/url-combiner';
import { i18nBreadcrumbResolver } from './i18n-breadcrumb.resolver';

describe('i18nBreadcrumbResolver', () => {
  describe('resolve', () => {
    let resolver: any;
    let i18nBreadcrumbService: any;
    let i18nKey: string;
    let route: any;
    let parentSegment;
    let segment;
    let expectedPath;
    beforeEach(() => {
      i18nKey = 'example.key';
      parentSegment = 'path';
      segment = 'breadcrumb';
      route = {
        data: { breadcrumbKey: i18nKey },
        routeConfig: {
          path: segment,
        },
        parent: {
          routeConfig: {
            path: parentSegment,
          },
        } as any,
      };
      expectedPath = new URLCombiner(parentSegment, segment).toString();
      i18nBreadcrumbService = {};
      resolver = i18nBreadcrumbResolver;
    });

    it('should resolve the breadcrumb config', () => {
      const resolvedConfig = resolver(route, {} as any, i18nBreadcrumbService);
      const expectedConfig = { provider: i18nBreadcrumbService, key: i18nKey, url: expectedPath };
      expect(resolvedConfig).toEqual(expectedConfig);
    });

    it('should resolve throw an error when no breadcrumbKey is defined', () => {
      expect(() => {
        resolver({ data: {} } as any, undefined, i18nBreadcrumbService);
      }).toThrow();
    });
  });
});
