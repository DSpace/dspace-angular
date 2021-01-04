import { first } from 'rxjs/operators';
import { CollectionPageResolver } from './collection-page.resolver';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';

describe('CollectionPageResolver', () => {
  describe('resolve', () => {
    let resolver: CollectionPageResolver;
    let collectionService: any;
    const uuid = '1234-65487-12354-1235';

    beforeEach(() => {
      collectionService = {
        findById: (id: string) => createSuccessfulRemoteDataObject$({ id })
      };
      resolver = new CollectionPageResolver(collectionService);
    });

    it('should resolve a collection with the correct id', (done) => {
      resolver.resolve({ params: { id: uuid } } as any, undefined)
        .pipe(first())
        .subscribe(
          (resolved) => {
            expect(resolved.payload.id).toEqual(uuid);
            done();
          }
        );
    });
  });
});
