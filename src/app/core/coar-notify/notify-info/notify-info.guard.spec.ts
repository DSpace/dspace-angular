import { of } from 'rxjs';

import { notifyInfoGuard } from './notify-info.guard';

describe('notifyInfoGuard', () => {
  let guard: any;
  let notifyInfoServiceSpy: any;
  let router: any;

  beforeEach(() => {
    notifyInfoServiceSpy = jasmine.createSpyObj('NotifyInfoService', ['isCoarConfigEnabled']);
    router = jasmine.createSpyObj('Router', ['parseUrl']);
    guard = notifyInfoGuard;
  });

  it('should be created', () => {
    notifyInfoServiceSpy.isCoarConfigEnabled.and.returnValue(of(true));
    expect(guard(null, null, notifyInfoServiceSpy, router)).toBeTruthy();
  });

  it('should return true if COAR config is enabled', (done) => {
    notifyInfoServiceSpy.isCoarConfigEnabled.and.returnValue(of(true));

    guard(null, null, notifyInfoServiceSpy, router).subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should call parseUrl method of Router if COAR config is not enabled', (done) => {
    notifyInfoServiceSpy.isCoarConfigEnabled.and.returnValue(of(false));
    router.parseUrl.and.returnValue(of('/404'));

    guard(null, null, notifyInfoServiceSpy, router).subscribe(() => {
      expect(router.parseUrl).toHaveBeenCalledWith('/404');
      done();
    });
  });

});
