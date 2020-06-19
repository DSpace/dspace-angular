import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbsComponent } from './breadcrumbs.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../shared/testing/translate-loader.mock';
import { BreadcrumbConfig } from './breadcrumb/breadcrumb-config.model';
import { BreadcrumbsService } from '../core/breadcrumbs/breadcrumbs.service';
import { Breadcrumb } from './breadcrumb/breadcrumb.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VarDirective } from '../shared/utils/var.directive';
import { getTestScheduler } from 'jasmine-marbles';

class TestBreadcrumbsService implements BreadcrumbsService<string> {
  getBreadcrumbs(key: string, url: string): Observable<Breadcrumb[]> {
    return observableOf([new Breadcrumb(key, url)]);
  }
}

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  let router: any;
  let route: any;
  let breadcrumbProvider;
  let breadcrumbConfigA: BreadcrumbConfig<string>;
  let breadcrumbConfigB: BreadcrumbConfig<string>;
  let expectedBreadcrumbs;

  function init() {
    breadcrumbProvider = new TestBreadcrumbsService();

    breadcrumbConfigA = { provider: breadcrumbProvider, key: 'example.path', url: 'example.com' };
    breadcrumbConfigB = { provider: breadcrumbProvider, key: 'another.path', url: 'another.com' };

    route = {
      root: {
        snapshot: {
          data: { breadcrumb: breadcrumbConfigA },
          routeConfig: { resolve: { breadcrumb: {} } }
        },
        firstChild: {
          snapshot: {
            // Example without resolver should be ignored
            data: { breadcrumb: breadcrumbConfigA },
          },
          firstChild: {
            snapshot: {
              data: { breadcrumb: breadcrumbConfigB },
              routeConfig: { resolve: { breadcrumb: {} } }
            }
          }
        }
      }
    };

    expectedBreadcrumbs = [
      new Breadcrumb(breadcrumbConfigA.key, breadcrumbConfigA.url),
      new Breadcrumb(breadcrumbConfigB.key, breadcrumbConfigB.url)
    ]

  }

  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [BreadcrumbsComponent, VarDirective],
      imports: [RouterTestingModule.withRoutes([]), TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), NgbModule],
      providers: [
        {provide: ActivatedRoute, useValue: route}
      ], schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'resolveBreadcrumbs').and.returnValue(observableOf([]));
    });

    it('should call resolveBreadcrumb on init', () => {
      router.events = observableOf(new NavigationEnd(0, '', ''));
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.resolveBreadcrumbs).toHaveBeenCalledWith(route.root);
    });
  });

  describe('resolveBreadcrumbs', () => {
    it('should return the correct breadcrumbs', () => {
      const breadcrumbs = component.resolveBreadcrumbs(route.root);
      getTestScheduler().expectObservable(breadcrumbs).toBe('(a|)', { a: expectedBreadcrumbs })
    })
  })
});
