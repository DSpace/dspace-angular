import { Observable } from 'rxjs/Observable';
import { UniversalService } from './universal.service';

describe('UniversalService', () => {
  let service: UniversalService;

  beforeEach(() => {
    service = new UniversalService({ select: () => undefined } as any);
  });

  describe('get isReplaying()', () => {
    it('should return true if /universal/isReplaying in the ngrx store is true', () => {
      spyOn((service as any).store, 'select').and.returnValue(Observable.of(true));
      const result = service.isReplaying;
      expect(result).toEqual(true);
    });

    it('should return false if /universal/isReplaying in the ngrx store is false', () => {
      spyOn((service as any).store, 'select').and.returnValue(Observable.of(false));
      const result = service.isReplaying;
      expect(result).toEqual(false);
    });

    it('should return false if /universal/isReplaying in the ngrx store is undefined', () => {
      spyOn((service as any).store, 'select').and.returnValue(Observable.of(undefined));
      const result = service.isReplaying;
      expect(result).toEqual(false);
    });
  });
});
