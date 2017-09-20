import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../app.reducer';
import { HostWindowState } from './host-window.reducer';

import { HostWindowService } from './host-window.service';

describe('HostWindowService', () => {
  let service: HostWindowService;
  let store: Store<AppState>;

  describe('', () => {
    beforeEach(() => {
      const _initialState = { hostWindow: { width: 1600, height: 770 } };
      store = new Store<AppState>(Observable.of(_initialState), undefined, undefined);
      service = new HostWindowService(store);
    });

    it('isXs() should return false with width = 1600', () => {
      service.isXs().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });

    it('isSm() should return false with width = 1600', () => {
      service.isSm().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });

    it('isMd() should return false with width = 1600', () => {
      service.isMd().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });
    it('isLg() should return false with width = 1600', () => {
      service.isLg().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });
    it('isXl() should return true with width = 1600', () => {
      service.isXl().subscribe((status) => {
        expect(status).toBeTruthy();
      });
    });
  });

  describe('', () => {
    beforeEach(() => {
      const _initialState = { hostWindow: { width: 1100, height: 770 } };
      store = new Store<AppState>(Observable.of(_initialState), undefined, undefined);
      service = new HostWindowService(store);
    });

    it('isXs() should return false with width = 1100', () => {
      service.isXs().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });

    it('isSm() should return false with width = 1100', () => {
      service.isSm().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });

    it('isMd() should return false with width = 1100', () => {
      service.isMd().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });
    it('isLg() should return true with width = 1100', () => {
      service.isLg().subscribe((status) => {
        expect(status).toBeTruthy();
      });
    });
    it('isXl() should return false with width = 1100', () => {
      service.isXl().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });
  });

  describe('', () => {
    beforeEach(() => {
      const _initialState = { hostWindow: { width: 800, height: 770 } };
      store = new Store<AppState>(Observable.of(_initialState), undefined, undefined);
      service = new HostWindowService(store);
    });

    it('isXs() should return false with width = 800', () => {
      service.isXs().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });

    it('isSm() should return false with width = 800', () => {
      service.isSm().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });

    it('isMd() should return true with width = 800', () => {
      service.isMd().subscribe((status) => {
        expect(status).toBeTruthy();
      });
    });
    it('isLg() should return false with width = 800', () => {
      service.isLg().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });
    it('isXl() should return false with width = 800', () => {
      service.isXl().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });
  });

  describe('', () => {
    beforeEach(() => {
      const _initialState = { hostWindow: { width: 600, height: 770 } };
      store = new Store<AppState>(Observable.of(_initialState), undefined, undefined);
      service = new HostWindowService(store);
    });

    it('isXs() should return false with width = 600', () => {
      service.isXs().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });

    it('isSm() should return true with width = 600', () => {
      service.isSm().subscribe((status) => {
        expect(status).toBeTruthy();
      });
    });

    it('isMd() should return false with width = 600', () => {
      service.isMd().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });
    it('isLg() should return false with width = 600', () => {
      service.isLg().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });
    it('isXl() should return false with width = 600', () => {
      service.isXl().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });
  });

  describe('', () => {
    beforeEach(() => {
      const _initialState = { hostWindow: { width: 400, height: 770 } };
      store = new Store<AppState>(Observable.of(_initialState), undefined, undefined);
      service = new HostWindowService(store);
    });

    it('isXs() should return true with width = 400', () => {
      service.isXs().subscribe((status) => {
        expect(status).toBeTruthy();
      });
    });

    it('isSm() should return false with width = 400', () => {
      service.isSm().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });

    it('isMd() should return false with width = 400', () => {
      service.isMd().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });
    it('isLg() should return false with width = 400', () => {
      service.isLg().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });
    it('isXl() should return false with width = 400', () => {
      service.isXl().subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });
  });

});
