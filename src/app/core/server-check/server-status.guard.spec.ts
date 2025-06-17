import { ServerStatusGuard } from './server-status-guard.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { of } from 'rxjs';
import { ServerStatusService } from './server-status.service';
import SpyObj = jasmine.SpyObj;

describe('ServerStatusGuard', () => {
  let guard: ServerStatusGuard;
  let serverStatusService: SpyObj<ServerStatusService>;
  let mockRouteSnapshot: ActivatedRouteSnapshot;
  let mockRouterStateSnapshot: RouterStateSnapshot;


  serverStatusService = jasmine.createSpyObj('ServerStatusService', [
    'checkServerAvailabilityFromStore',
    'navigateToInternalServerErrorPage',
  ]);

  beforeEach(() => {
    guard = new ServerStatusGuard(serverStatusService);
    mockRouteSnapshot = {} as ActivatedRouteSnapshot;
    mockRouterStateSnapshot = {} as RouterStateSnapshot;
  });

  afterEach(() => {
    serverStatusService.checkServerAvailabilityFromStore.calls.reset();
    serverStatusService.navigateToInternalServerErrorPage.calls.reset();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });


  describe('canActivate', () => {
    it('should allow child activation when server status is available in the store', (done) => {
      serverStatusService.checkServerAvailabilityFromStore.and.returnValue(of(true));

      guard.canActivateChild(mockRouteSnapshot, mockRouterStateSnapshot).subscribe((result) => {
        expect(result).toBeTrue();
        expect(serverStatusService.checkServerAvailabilityFromStore).toHaveBeenCalled();
        expect(serverStatusService.navigateToInternalServerErrorPage).not.toHaveBeenCalled();
        done();
      });
    });
  });

  it('should redirect to the 500 error page when server status is unavailable in the store', (done) => {
    serverStatusService.checkServerAvailabilityFromStore.and.returnValue(of(false));

    guard.canActivateChild(mockRouteSnapshot, mockRouterStateSnapshot).subscribe((result) => {
      expect(result).toBeFalse();
      expect(serverStatusService.checkServerAvailabilityFromStore).toHaveBeenCalled();
      expect(serverStatusService.navigateToInternalServerErrorPage).toHaveBeenCalled();
      done();
    });
  });
});
