import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { collectionPageResolver } from './collection-page.resolver';

describe('collectionPageResolver', () => {
  describe('resolve', () => {
    let resolver: any;
    let collectionService: any;
    let store: any;
    const uuid = '1234-65487-12354-1235';

    beforeEach(() => {
      collectionService = {
        findById: (id: string) => createSuccessfulRemoteDataObject$({ id }),
      };
      store = jasmine.createSpyObj('store', {
        dispatch: {},
      });
      resolver = collectionPageResolver;
    });

    it('should resolve a collection with the correct id', (done) => {
      (resolver({ params: { id: uuid } } as any, { url: 'current-url' } as any, collectionService, store) as Observable<any>).pipe(first())
        .subscribe(
          (resolved) => {
            expect(resolved.payload.id).toEqual(uuid);
            done();
          },
        );
    });
  });
});
