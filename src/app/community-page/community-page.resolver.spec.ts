import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { communityPageResolver } from './community-page.resolver';

describe('communityPageResolver', () => {
  describe('resolve', () => {
    let resolver: any;
    let communityService: any;
    let store: any;
    const uuid = '1234-65487-12354-1235';

    beforeEach(() => {
      communityService = {
        findById: (id: string) => createSuccessfulRemoteDataObject$({ id }),
      };
      store = jasmine.createSpyObj('store', {
        dispatch: {},
      });
      resolver = communityPageResolver;
    });

    it('should resolve a community with the correct id', (done) => {
      (resolver({ params: { id: uuid } } as any, { url: 'current-url' } as any, communityService, store) as Observable<any>)
        .pipe(first())
        .subscribe(
          (resolved) => {
            expect(resolved.payload.id).toEqual(uuid);
            done();
          },
        );
    });
  });
});
