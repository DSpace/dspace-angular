import {QualityAssuranceBreadcrumbResolver} from './quality-assurance-breadcrumb.resolver';

describe('QualityAssuranceBreadcrumbResolver', () => {
  describe('resolve', () => {
    let resolver: QualityAssuranceBreadcrumbResolver;
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
          topicId: 'testTopicId'
        }
      };
      qualityAssuranceBreadcrumbService = {};
      resolver = new QualityAssuranceBreadcrumbResolver(qualityAssuranceBreadcrumbService);
    });

    it('should resolve the breadcrumb config', () => {
      const resolvedConfig = resolver.resolve(route as any, {url: fullPath + 'testSourceId'} as any);
      const expectedConfig = { provider: qualityAssuranceBreadcrumbService, key: expectedKey, url: fullPath };
      expect(resolvedConfig).toEqual(expectedConfig);
    });
  });
});
