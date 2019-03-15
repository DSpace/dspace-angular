import { CreateCommunityPageGuard } from './create-community-page.guard';
import { MockRouter } from '../../shared/mocks/mock-router';
import { RemoteData } from '../../core/data/remote-data';
import { Community } from '../../core/shared/community.model';
import { of as observableOf } from 'rxjs';
import { first } from 'rxjs/operators';

describe('CreateCommunityPageGuard', () => {
  describe('canActivate', () => {
    let guard: CreateCommunityPageGuard;
    let router;
    let communityDataServiceStub: any;

    beforeEach(() => {
      communityDataServiceStub = {
        findById: (id: string) => {
          if (id === 'valid-id') {
            return observableOf(new RemoteData(false, false, true, null, new Community()));
          } else if (id === 'invalid-id') {
            return observableOf(new RemoteData(false, false, true, null, undefined));
          } else if (id === 'error-id') {
            return observableOf(new RemoteData(false, false, false, null, new Community()));
          }
        }
      };
      router = new MockRouter();

      guard = new CreateCommunityPageGuard(router, communityDataServiceStub);
    });

    it('should return true when the parent ID resolves to a community', () => {
      guard.canActivate({ queryParams: { parent: 'valid-id' } } as any, undefined)
        .pipe(first())
        .subscribe(
          (canActivate) =>
            expect(canActivate).toEqual(true)
        );
    });

    it('should return true when no parent ID has been provided', () => {
      guard.canActivate({ queryParams: { } } as any, undefined)
        .pipe(first())
        .subscribe(
          (canActivate) =>
            expect(canActivate).toEqual(true)
        );
    });

    it('should return false when the parent ID does not resolve to a community', () => {
      guard.canActivate({ queryParams: { parent: 'invalid-id' } } as any, undefined)
        .pipe(first())
        .subscribe(
          (canActivate) =>
            expect(canActivate).toEqual(false)
        );
    });

    it('should return false when the parent ID resolves to an error response', () => {
      guard.canActivate({ queryParams: { parent: 'error-id' } } as any, undefined)
        .pipe(first())
        .subscribe(
          (canActivate) =>
            expect(canActivate).toEqual(false)
        );
    });
  });
});
