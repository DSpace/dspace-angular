import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterEvent,
  UrlTree,
} from '@angular/router';
import {
  of,
  ReplaySubject,
} from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { RootDataService } from '../data/root-data.service';
import { ServerCheckGuard } from './server-check.guard';
import SpyObj = jasmine.SpyObj;

describe('ServerCheckGuard', () => {
  let guard: any;
  let router: Router;
  let eventSubject: ReplaySubject<RouterEvent>;
  let rootDataServiceStub: SpyObj<RootDataService>;
  let testScheduler: TestScheduler;
  let redirectUrlTree: UrlTree;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    rootDataServiceStub = jasmine.createSpyObj('RootDataService', {
      checkServerAvailability: jasmine.createSpy('checkServerAvailability'),
      invalidateRootCache: jasmine.createSpy('invalidateRootCache'),
      findRoot: jasmine.createSpy('findRoot'),
    });
    redirectUrlTree = new UrlTree();
    eventSubject = new ReplaySubject<RouterEvent>(1);
    router = {
      events: eventSubject.asObservable(),
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
      parseUrl: jasmine.createSpy('parseUrl').and.returnValue(redirectUrlTree),
    } as any;
    guard = ServerCheckGuard;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('when root endpoint request has succeeded', () => {
    beforeEach(() => {
      rootDataServiceStub.checkServerAvailability.and.returnValue(of(true));
    });

    it('should return true', () => {
      testScheduler.run(({ expectObservable }) => {
        const result$ = guard({} as any, {} as any, rootDataServiceStub, router);
        expectObservable(result$).toBe('(a|)', { a: true });
      });
    });
  });

  describe('when root endpoint request has not succeeded', () => {
    beforeEach(() => {
      rootDataServiceStub.checkServerAvailability.and.returnValue(of(false));
    });

    it('should return a UrlTree with the route to the 500 error page', () => {
      testScheduler.run(({ expectObservable }) => {
        const result$ = guard({} as any, {} as any, rootDataServiceStub, router);
        expectObservable(result$).toBe('(b|)', { b: redirectUrlTree });
      });
      expect(router.parseUrl).toHaveBeenCalledWith('/500');
    });
  });

  xdescribe(`listenForRouteChanges`, () => {
    it(`should invalidate the root cache, when the method is first called`, () => {
      testScheduler.run(() => {
        guard.listenForRouteChanges();
        expect(rootDataServiceStub.invalidateRootCache).toHaveBeenCalledTimes(1);
      });
    });

    it(`should invalidate the root cache on every NavigationStart event`, () => {
      testScheduler.run(() => {
        guard.listenForRouteChanges();
        eventSubject.next(new NavigationStart(1,''));
        eventSubject.next(new NavigationEnd(1,'', ''));
        eventSubject.next(new NavigationStart(2,''));
        eventSubject.next(new NavigationEnd(2,'', ''));
        eventSubject.next(new NavigationStart(3,''));
      });
      // once when the method is first called, and then 3 times for NavigationStart events
      expect(rootDataServiceStub.invalidateRootCache).toHaveBeenCalledTimes(1 + 3);
    });
  });
});
