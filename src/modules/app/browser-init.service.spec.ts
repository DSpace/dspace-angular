/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { NavigationStart } from '@angular/router';
import { Subject } from 'rxjs';

import { BrowserInitService } from './browser-init.service';

describe('BrowserInitService', () => {
  describe('listenForRouteChanges', () => {
    let service: BrowserInitService;
    let rootDataServiceSpy;
    let routerEvents$: Subject<any>;

    beforeEach(() => {
      rootDataServiceSpy = jasmine.createSpyObj('rootDataService', ['invalidateRootCache']);
      routerEvents$ = new Subject();

      service = new BrowserInitService(
        null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        rootDataServiceSpy,
        { events: routerEvents$.asObservable() } as any,
        null, null, null, null,
      );

      (service as any).listenForRouteChanges();
    });

    it('should invalidate the root endpoint cache once, at init', () => {
      expect(rootDataServiceSpy.invalidateRootCache).toHaveBeenCalledTimes(1);
    });

    it('should not invalidate the root endpoint cache again on subsequent NavigationStart events', () => {
      routerEvents$.next(new NavigationStart(1, '/some-route'));
      routerEvents$.next(new NavigationStart(2, '/another-route'));

      expect(rootDataServiceSpy.invalidateRootCache).toHaveBeenCalledTimes(1);
    });
  });
});
