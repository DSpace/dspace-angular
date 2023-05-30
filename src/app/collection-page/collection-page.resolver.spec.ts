import { first } from 'rxjs/operators';
import { CollectionPageResolver } from './collection-page.resolver';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';

describe('CollectionPageResolver', () => {
  describe('resolve', () => {
    let resolver: CollectionPageResolver;
    let collectionService: any;
    let store: any;
    let router: any;
    const uuid = '1234-65487-12354-1235';

    beforeEach(() => {
      router = TestBed.inject(Router);
      collectionService = {
        findById: (id: string) => createSuccessfulRemoteDataObject$({ id })
      };
      store = jasmine.createSpyObj('store', {
        dispatch: {},
      });
      resolver = new CollectionPageResolver(collectionService, store, router);
    });

    it('should resolve a collection with the correct id', (done) => {
      resolver.resolve({ params: { id: uuid } } as any, { url: 'current-url' } as any)
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
