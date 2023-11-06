import { TestBed } from '@angular/core/testing';

import { NotifyInfoGuard } from './notify-info.guard';
import { Router } from '@angular/router';
import { NotifyInfoService } from './notify-info.service';
import { of } from 'rxjs';

describe('NotifyInfoGuard', () => {
  let guard: NotifyInfoGuard;
  let notifyInfoServiceSpy: any;
  let router: any;

  beforeEach(() => {
    notifyInfoServiceSpy = jasmine.createSpyObj('NotifyInfoService', ['isCoarConfigEnabled']);
    router = jasmine.createSpyObj('Router', ['parseUrl']);
    TestBed.configureTestingModule({
      providers: [
        NotifyInfoGuard,
        { provide: NotifyInfoService, useValue: notifyInfoServiceSpy},
        { provide: Router, useValue: router}
      ]
    });
    guard = TestBed.inject(NotifyInfoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if COAR config is enabled', (done) => {
    notifyInfoServiceSpy.isCoarConfigEnabled.and.returnValue(of(true));

    guard.canActivate(null, null).subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should call parseUrl method of Router if COAR config is not enabled', (done) => {
    notifyInfoServiceSpy.isCoarConfigEnabled.and.returnValue(of(false));
    router.parseUrl.and.returnValue(of('/404'));

    guard.canActivate(null, null).subscribe(() => {
      expect(router.parseUrl).toHaveBeenCalledWith('/404');
      done();
    });
  });

});
