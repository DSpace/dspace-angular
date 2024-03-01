import { PublicationClaimBreadcrumbResolver } from './publication-claim-breadcrumb.resolver';

describe('PublicationClaimBreadcrumbResolver', () => {
  describe('resolve', () => {
    let resolver: PublicationClaimBreadcrumbResolver;
    let publicationClaimBreadcrumbService: any;
    const fullPath = '/test/publication-claim/openaire:6bee076d-4f2a-4555-a475-04a267769b2a';
    const expectedKey = '6bee076d-4f2a-4555-a475-04a267769b2a';
    const expectedId = 'openaire:6bee076d-4f2a-4555-a475-04a267769b2a';
    let route;

    beforeEach(() => {
      route = {
        paramMap: {
          get: function (param) {
            return this[param];
          },
          targetId: expectedId,
        }
      };
      publicationClaimBreadcrumbService = {};
      resolver = new PublicationClaimBreadcrumbResolver(publicationClaimBreadcrumbService);
    });

    it('should resolve the breadcrumb config', () => {
      const resolvedConfig = resolver.resolve(route as any, {url: fullPath } as any);
      const expectedConfig = { provider: publicationClaimBreadcrumbService, key: expectedKey };
      expect(resolvedConfig).toEqual(expectedConfig);
    });
  });
});
