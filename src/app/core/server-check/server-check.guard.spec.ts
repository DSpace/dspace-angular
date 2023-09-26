import { ServerCheckGuard } from './server-check.guard';
import { Router, NavigationStart, UrlTree, NavigationEnd, RouterEvent } from '@angular/router';

import { of, ReplaySubject } from 'rxjs';
import { RootDataService } from '../data/root-data.service';
import { TestScheduler } from 'rxjs/testing';
import SpyObj = jasmine.SpyObj;

describe('ServerCheckGuard', () => {
  let guard: ServerCheckGuard;
  let router: Router;
  const eventSubject = new ReplaySubject<RouterEvent>(1);
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
      findRoot: jasmine.createSpy('findRoot')
    });
    redirectUrlTree = new UrlTree();
    router = {
      events: eventSubject.asObservable(),
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
      parseUrl: jasmine.createSpy('parseUrl').and.returnValue(redirectUrlTree)
    } as any;
    guard = new ServerCheckGuard(router, rootDataServiceStub);
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
        const result$ = guard.canActivateChild({} as any, {} as any);
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
        const result$ = guard.canActivateChild({} as any, {} as any);
        expectObservable(result$).toBe('(b|)', { b: redirectUrlTree });
      });
      expect(router.parseUrl).toHaveBeenCalledWith('/500');
    });
  });

  describe(`listenForRouteChanges`, () => {
    it(`should retrieve the root endpoint, without using the cache, when the method is first called`, () => {
        testScheduler.run(() => {
          guard.listenForRouteChanges();
          expect(rootDataServiceStub.findRoot).toHaveBeenCalledWith(false);
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
        expect(rootDataServiceStub.invalidateRootCache).toHaveBeenCalledTimes(3);
    });
  });
});
