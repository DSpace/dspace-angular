import { qualityAssuranceBreadcrumbResolver } from './quality-assurance-breadcrumb.resolver';

describe('qualityAssuranceBreadcrumbResolver', () => {
  describe('resolve', () => {
    let resolver: any;
    let qualityAssuranceBreadcrumbService: any;
    let route: any;
    const fullPath = '/test/quality-assurance/';
    const expectedKey = 'testSourceId:testTopicId';

    beforeEach(() => {
      route = {
        paramMap: {
          get: function (param) {
            return this[param];
          },
          sourceId: 'testSourceId',
          topicId: 'testTopicId',
        },
      };
      qualityAssuranceBreadcrumbService = {};
      resolver = qualityAssuranceBreadcrumbResolver;
    });

    it('should resolve the breadcrumb config', () => {
      const resolvedConfig = resolver(route as any, { url: fullPath + 'testSourceId' } as any, qualityAssuranceBreadcrumbService);
      const expectedConfig = { provider: qualityAssuranceBreadcrumbService, key: expectedKey, url: fullPath };
      expect(resolvedConfig).toEqual(expectedConfig);
    });
  });
});
