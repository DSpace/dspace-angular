import { ServerCheckGuard } from './server-check.guard';
import { createFailedRemoteDataObject$, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { first } from 'rxjs/operators';
import { getPageInternalServerErrorRoute } from '../../app-routing-paths';

describe('ServerCheckGuard', () => {
  let guard: ServerCheckGuard;
  let router;
  let rootDataServiceStub: any;

  rootDataServiceStub = jasmine.createSpyObj('RootDataService', {
    findRoot: jasmine.createSpy('findRoot')
  });
  router = jasmine.createSpyObj('Router', {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  });

  beforeEach(() => {
    guard = new ServerCheckGuard(router, rootDataServiceStub);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('when root endpoint has succeeded', () => {
    beforeEach(() => {
      rootDataServiceStub.findRoot.and.returnValue(createSuccessfulRemoteDataObject$({}));
    });

    it('should not redirect to error page', () => {
      guard.canActivate({} as any, {} as any).pipe(
        first()
      ).subscribe((canActivate: boolean) => {
        expect(canActivate).toEqual(true);
        expect(router.navigateByUrl).not.toHaveBeenCalled();
      });
    });
  });

  describe('when root endpoint has not succeeded', () => {
    beforeEach(() => {
      rootDataServiceStub.findRoot.and.returnValue(createFailedRemoteDataObject$());
    });

    it('should redirect to error page', () => {
      guard.canActivate({} as any, {} as any).pipe(
        first()
      ).subscribe((canActivate: boolean) => {
        expect(canActivate).toEqual(false);
        expect(router.navigateByUrl).toHaveBeenCalledWith(getPageInternalServerErrorRoute());
      });
    });
  });
});
