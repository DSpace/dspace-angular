import { first } from 'rxjs/operators';
import { CommunityPageResolver } from './community-page.resolver';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';

describe('CommunityPageResolver', () => {
  describe('resolve', () => {
    let resolver: CommunityPageResolver;
    let communityService: any;
    let store: any;
    let router: any;
    const uuid = '1234-65487-12354-1235';

    beforeEach(() => {
      router = TestBed.inject(Router);
      communityService = {
        findById: (id: string) => createSuccessfulRemoteDataObject$({ id })
      };
      store = jasmine.createSpyObj('store', {
        dispatch: {},
      });
      resolver = new CommunityPageResolver(communityService, store, router);
    });

    it('should resolve a community with the correct id', (done) => {
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
