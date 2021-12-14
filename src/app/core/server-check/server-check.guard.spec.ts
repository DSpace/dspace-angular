import { ServerCheckGuard } from './server-check.guard';
import { createFailedRemoteDataObject$, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { take } from 'rxjs/operators';
import { getPageInternalServerErrorRoute } from '../../app-routing-paths';
import { Router } from '@angular/router';
import { RootDataService } from '../data/root-data.service';
import { Root } from '../data/root.model';
import SpyObj = jasmine.SpyObj;

describe('ServerCheckGuard', () => {
  let guard: ServerCheckGuard;
  let router: SpyObj<Router>;
  let rootDataServiceStub: SpyObj<RootDataService>;

  rootDataServiceStub = jasmine.createSpyObj('RootDataService', {
    findRoot: jasmine.createSpy('findRoot'),
    invalidateRootCache: jasmine.createSpy('invalidateRootCache')
  });
  router = jasmine.createSpyObj('Router', {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  });

  beforeEach(() => {
    guard = new ServerCheckGuard(router, rootDataServiceStub);
  });

  afterEach(() => {
    router.navigateByUrl.calls.reset();
    rootDataServiceStub.invalidateRootCache.calls.reset();
    rootDataServiceStub.findRoot.calls.reset();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('when root endpoint has succeeded', () => {
    beforeEach(() => {
      rootDataServiceStub.findRoot.and.returnValue(createSuccessfulRemoteDataObject$<Root>({} as any));
    });

    it('should not redirect to error page', () => {
      guard.canActivateChild({} as any, {} as any).pipe(
        take(1)
      ).subscribe((canActivate: boolean) => {
        expect(canActivate).toEqual(true);
        expect(rootDataServiceStub.invalidateRootCache).not.toHaveBeenCalled();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
      });
    });
  });

  describe('when root endpoint has not succeeded', () => {
    beforeEach(() => {
      rootDataServiceStub.findRoot.and.returnValue(createFailedRemoteDataObject$<Root>());
    });

    it('should redirect to error page', () => {
      guard.canActivateChild({} as any, {} as any).pipe(
        take(1)
      ).subscribe((canActivate: boolean) => {
        expect(canActivate).toEqual(false);
        expect(rootDataServiceStub.invalidateRootCache).toHaveBeenCalled();
        expect(router.navigateByUrl).toHaveBeenCalledWith(getPageInternalServerErrorRoute());
      });
    });
  });
});
