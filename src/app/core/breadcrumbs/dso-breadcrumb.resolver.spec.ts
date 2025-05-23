import { getTestScheduler } from 'jasmine-marbles';

import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { Collection } from '../shared/collection.model';
import { collectionBreadcrumbResolver } from './collection-breadcrumb.resolver';

describe('DSOBreadcrumbResolver', () => {
  describe('resolve', () => {
    let resolver: any;
    let collectionService: any;
    let dsoBreadcrumbService: any;
    let testCollection: Collection;
    let uuid;
    let breadcrumbUrl;
    let currentUrl;

    beforeEach(() => {
      uuid = '1234-65487-12354-1235';
      breadcrumbUrl = `/collections/${uuid}`;
      currentUrl = `${breadcrumbUrl}/edit`;
      testCollection = Object.assign(new Collection(), {
        uuid: uuid,
        type: 'collection',
      });
      dsoBreadcrumbService = {};
      collectionService = {
        findById: () => createSuccessfulRemoteDataObject$(testCollection),
      };
      resolver = collectionBreadcrumbResolver;
    });

    it('should resolve a breadcrumb config for the correct DSO', () => {
      const resolvedConfig = resolver({ params: { id: uuid } } as any, { url: currentUrl } as any, dsoBreadcrumbService, collectionService);
      const expectedConfig = { provider: dsoBreadcrumbService, key: testCollection, url: breadcrumbUrl };
      getTestScheduler().expectObservable(resolvedConfig).toBe('(a|)', { a: expectedConfig });
    });
  });
});
