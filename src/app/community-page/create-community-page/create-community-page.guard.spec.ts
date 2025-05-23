import { first } from 'rxjs/operators';

import { Community } from '../../core/shared/community.model';
import { RouterMock } from '../../shared/mocks/router.mock';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { createCommunityPageGuard } from './create-community-page.guard';

describe('createCommunityPageGuard', () => {
  describe('canActivate', () => {
    let guard: any;
    let router;
    let communityDataServiceStub: any;

    beforeEach(() => {
      communityDataServiceStub = {
        findById: (id: string) => {
          if (id === 'valid-id') {
            return createSuccessfulRemoteDataObject$(new Community());
          } else if (id === 'invalid-id') {
            return createSuccessfulRemoteDataObject$(undefined);
          } else if (id === 'error-id') {
            return createFailedRemoteDataObject$('not found', 404);
          }
        },
      };
      router = new RouterMock();

      guard = createCommunityPageGuard;
    });

    it('should return true when the parent ID resolves to a community', () => {
      guard({ queryParams: { parent: 'valid-id' } } as any, undefined, communityDataServiceStub, router)
        .pipe(first())
        .subscribe(
          (canActivate) =>
            expect(canActivate).toEqual(true),
        );
    });

    it('should return true when no parent ID has been provided', () => {
      guard({ queryParams: { } } as any, undefined, communityDataServiceStub, router)
        .pipe(first())
        .subscribe(
          (canActivate) =>
            expect(canActivate).toEqual(true),
        );
    });

    it('should return false when the parent ID does not resolve to a community', () => {
      guard({ queryParams: { parent: 'invalid-id' } } as any, undefined, communityDataServiceStub, router)
        .pipe(first())
        .subscribe(
          (canActivate) =>
            expect(canActivate).toEqual(false),
        );
    });

    it('should return false when the parent ID resolves to an error response', () => {
      guard({ queryParams: { parent: 'error-id' } } as any, undefined, communityDataServiceStub, router)
        .pipe(first())
        .subscribe(
          (canActivate) =>
            expect(canActivate).toEqual(false),
        );
    });
  });
});
