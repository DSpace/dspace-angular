import { EditDsoResolver } from './edit-dso.resolver';
import { Collection } from '../collection.model';
import { EditCollectionResolver } from './edit-collection.resolver';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { waitForAsync } from '@angular/core/testing';

describe('EditDsoResolver', () => {
  describe('resolve', () => {
    let resolver: EditDsoResolver<Collection>;
    let collectionService: any;
    let testCollection: Collection;
    let uuid;
    let currentUrl = 'collection/1234-65487-12354-1235/edit/metadata';

    beforeEach(() => {
      uuid = '1234-65487-12354-1235';
      testCollection = Object.assign(new Collection(), { uuid });
      collectionService = {
        findByIdWithProjections: (id: string) => createSuccessfulRemoteDataObject$(testCollection)
      };
      resolver = new EditCollectionResolver(collectionService);
    });

    it('should resolve a collection from the id and by passing the projections', waitForAsync(() => {
      const resolvedConfig = resolver.resolve({ params: { id: uuid } } as any, { url: currentUrl } as any);
      resolvedConfig.subscribe((response) => {
        expect(response).toEqual(createSuccessfulRemoteDataObject(testCollection));
      });
    }));
  });
});
