/* tslint:disable:max-classes-per-file */
import { TestBed } from '@angular/core/testing';

import { BreadcrumbsService } from './breadcrumbs.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, Resolve, Route, Router } from '@angular/router';
import { Component } from '@angular/core';
import { BreadcrumbConfig } from './breadcrumb/breadcrumb-config.model';
import { BreadcrumbsProviderService } from '../core/breadcrumbs/breadcrumbsProviderService';
import { Observable, of as observableOf } from 'rxjs';
import { Breadcrumb } from './breadcrumb/breadcrumb.model';

/**
 * Create the breadcrumbs
 */
class TestBreadcrumbsProviderService implements BreadcrumbsProviderService<string> {
  getBreadcrumbs(key: string, url: string): Observable<Breadcrumb[]> {
    return observableOf([new Breadcrumb(key, url)]);
  }
}

/**
 * Empty component used for every route
 */
@Component({ template: '' })
class DummyComponent {}

/**
 * {@link BreadcrumbsService#resolveBreadcrumbs} requires that a breadcrumb resolver is present,
 * or data.breadcrumb will be ignored.
 * This class satisfies the requirement and sets data.breadcrumb.
 */
class TestBreadcrumbResolver implements Resolve<BreadcrumbConfig<string>> {
  resolve(route: ActivatedRouteSnapshot): BreadcrumbConfig<string> {
    console.log('route:', route);
    return route.data.returnValueForTestBreadcrumbResolver;
  }
}

describe('BreadcrumbsService', () => {
  let service: BreadcrumbsService;
  let router: any;
  let breadcrumbProvider;
  let breadcrumbConfigA: BreadcrumbConfig<string>;
  let breadcrumbConfigB: BreadcrumbConfig<string>;

  const initRoute = (path: string, showBreadcrumbs: boolean, breadcrumbConfig: BreadcrumbConfig<string>): Route => ({
    path: path,
    component: DummyComponent,
    data: {
      showBreadcrumbs: showBreadcrumbs,
      returnValueForTestBreadcrumbResolver: breadcrumbConfig,
    },
    resolve: {
      breadcrumb: TestBreadcrumbResolver,
    }
  });

  const initBreadcrumbs = () => {
    breadcrumbProvider = new TestBreadcrumbsProviderService();
    breadcrumbConfigA = { provider: breadcrumbProvider, key: 'example.path', url: 'example.com' };
    breadcrumbConfigB = { provider: breadcrumbProvider, key: 'another.path', url: 'another.com' };
  };

  beforeEach(() => {
    initBreadcrumbs();
    TestBed.configureTestingModule({
      providers: [
        TestBreadcrumbResolver,
      ],
      imports: [
        RouterTestingModule.withRoutes([
          initRoute('route-1', undefined, undefined),
          initRoute('route-2', false, breadcrumbConfigA),
          initRoute('route-3', true, breadcrumbConfigB),
        ]),
      ],
    });
    router = TestBed.inject(Router);
    service = TestBed.inject(BreadcrumbsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('breadcrumbs$', () => {
    it('should return a breadcrumb corresponding to the current route', () => {
      // TODO
      service.breadcrumbs$.subscribe((value) => {
        console.log('TEST');
        console.log(value);
      });
      router.navigate(['route-3']);
    });

    it('should change when the route changes', () => {
      // TODO
    });
  });

  describe('showBreadcrumbs$', () => {
    describe('when the last part of the route has showBreadcrumbs in its data', () => {
      it('should return that value', () => {
        // TODO
      });
    });

    describe('when the last part of the route has no breadcrumb in its data', () => {
      it('should return false', () => {
        // TODO
      });
    });
  });

});
