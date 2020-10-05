import { first } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';
import { BulkImportPageResolver } from './bulk-import-page.resolver';

describe('BulkImportPageResolver', () => {
  describe('resolve', () => {
    let resolver: BulkImportPageResolver;
    let collectionService: any;
    const uuid = '1234-65487-12354-1235';

    beforeEach(() => {
      collectionService = {
        findById: (id: string) => observableOf({ payload: { id }, hasSucceeded: true })
      };
      resolver = new BulkImportPageResolver(collectionService);
    });

    it('should resolve a collection with the correct id', () => {
      resolver.resolve({ params: { id: uuid } } as any, undefined)
        .pipe(first())
        .subscribe(
          (resolved) => {
            expect(resolved.payload.id).toEqual(uuid);
          }
        );
    });
  });
});
