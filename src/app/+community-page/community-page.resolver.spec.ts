import { of as observableOf } from 'rxjs';
import { first } from 'rxjs/operators';
import { CommunityPageResolver } from './community-page.resolver';

describe('CommunityPageResolver', () => {
  describe('resolve', () => {
    let resolver: CommunityPageResolver;
    let communityService: any;
    const uuid = '1234-65487-12354-1235';

    beforeEach(() => {
      communityService = {
        findById: (id: string) => observableOf({ payload: { id }, hasSucceeded: true })
      };
      resolver = new CommunityPageResolver(communityService);
    });

    it('should resolve a community with the correct id', () => {
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
