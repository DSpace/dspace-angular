import { DsoContextBreadcrumbResolver } from './dso-context-breadcrumb.resolver';
import { Collection } from '../shared/collection.model';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';

describe('DsoContextBreadcrumbResolver', () => {
  describe('resolve', () => {
    let resolver: any;
    let collectionService: any;
    let dsoBreadcrumbService: any;
    let testCollection: Collection;
    let uuid;
    let breadcrumbUrl;
    let currentUrl;
    let breadcrumbKey = 'statistics';

    beforeEach(() => {
      uuid = '1234-65487-12354-1235';
      breadcrumbUrl = '/collections/' + uuid;
      currentUrl = breadcrumbUrl + '/edit';
      testCollection = Object.assign(new Collection(), { uuid });
      dsoBreadcrumbService = {};
      breadcrumbKey = 'statistics';
      collectionService = {
        findById: (id: string) => createSuccessfulRemoteDataObject$(testCollection)
      };
      resolver = new DsoContextBreadcrumbResolver(dsoBreadcrumbService);
    });

    it('should resolve a breadcrumb config for the correct DSO', () => {
      const resolvedConfig = resolver.resolve({ params: { id: uuid }, data : { breadcrumbKey: breadcrumbKey } } as any, { url: currentUrl } as any);
      const expectedConfig = { provider: dsoBreadcrumbService, key: uuid + '::' + breadcrumbKey, url: breadcrumbUrl };
      expect(resolvedConfig).toEqual(expectedConfig);
    });
  });
});
