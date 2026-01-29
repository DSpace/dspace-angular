import { sourcesBreadcrumbResolver } from './sources-breadcrumb.resolver';

describe('sourcesBreadcrumbResolver', () => {
  describe('resolve', () => {
    let resolver: any;
    let sourcesBreadcrumbService: any;
    let route: any;
    const i18nKey = 'breadcrumbKey';
    const fullPath = '/test/quality-assurance/';
    const expectedKey = 'breadcrumbKey:testSourceId:testTopicId';

    beforeEach(() => {
      route = {
        data: { breadcrumbKey: i18nKey },
        paramMap: {
          get: function (param) {
            return this[param];
          },
          sourceId: 'testSourceId',
          topicId: 'testTopicId',
        },
      };
      sourcesBreadcrumbService = {};
      resolver = sourcesBreadcrumbResolver;
    });

    it('should resolve the breadcrumb config', () => {
      const resolvedConfig = resolver(route as any, { url: fullPath + 'testSourceId' } as any, sourcesBreadcrumbService);
      const expectedConfig = { provider: sourcesBreadcrumbService, key: expectedKey, url: fullPath };
      expect(resolvedConfig).toEqual(expectedConfig);
    });
  });
});
