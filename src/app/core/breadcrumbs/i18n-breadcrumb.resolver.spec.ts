import { I18nBreadcrumbResolver } from './i18n-breadcrumb.resolver';

describe('I18nBreadcrumbResolver', () => {
  describe('resolve', () => {
    let resolver: I18nBreadcrumbResolver;
    let i18nBreadcrumbService: any;
    let i18nKey: string;
    let path: string;
    beforeEach(() => {
      i18nKey = 'example.key';
      path = 'rest.com/path/to/breadcrumb';
      i18nBreadcrumbService = {};
      resolver = new I18nBreadcrumbResolver(i18nBreadcrumbService);
    });

    it('should resolve the breadcrumb config', () => {
      const resolvedConfig = resolver.resolve({ data: { breadcrumbKey: i18nKey }, url: [path] } as any, {} as any);
      const expectedConfig = { provider: i18nBreadcrumbService, key: i18nKey, url: path };
      expect(resolvedConfig).toEqual(expectedConfig);
    });

    it('should resolve throw an error when no breadcrumbKey is defined', () => {
      expect(() => {
        resolver.resolve({ data: {} } as any, undefined)
      }).toThrow();
    });
  });
});
