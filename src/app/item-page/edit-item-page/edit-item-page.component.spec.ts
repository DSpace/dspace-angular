import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterModule,
  RouterStateSnapshot,
} from '@angular/router';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { Item } from '../../core/shared/item.model';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { EditItemPageComponent } from './edit-item-page.component';

describe('EditItemPageComponent', () => {
  let comp: EditItemPageComponent;
  let fixture: ComponentFixture<EditItemPageComponent>;

  const AcceptAllGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> => {
    return observableOf(true);
  };

  const AcceptNoneGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> => {
    return observableOf(false);
  };

  const accessiblePages = ['accessible'];
  const inaccessiblePages = ['inaccessible', 'inaccessibleDoubleGuard'];
  const mockRoute = {
    snapshot: {
      firstChild: {
        routeConfig: {
          path: accessiblePages[0],
        },
      },
      routerState: {
        snapshot: undefined,
      },
    },
    routeConfig: {
      children: [
        {
          path: accessiblePages[0],
          canActivate: [AcceptAllGuard],
        }, {
          path: inaccessiblePages[0],
          canActivate: [AcceptNoneGuard],
        }, {
          path: inaccessiblePages[1],
          canActivate: [AcceptAllGuard, AcceptNoneGuard],
        },
      ],
    },
    data: observableOf({ dso: createSuccessfulRemoteDataObject(new Item()) }),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        EditItemPageComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(EditItemPageComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(EditItemPageComponent);
    comp = fixture.componentInstance;
    // spyOn((comp as any).injector, 'get').and.callFake((a) => new a());
    fixture.detectChanges();
  }));

  describe('ngOnInit', () => {
    it('should enable tabs that the user can activate', fakeAsync(() => {
      const enabledItems = fixture.debugElement.queryAll(By.css('a.nav-link'));
      expect(enabledItems.length).toBe(accessiblePages.length);
    }));

    it('should disable tabs that the user can not activate', () => {
      const disabledItems = fixture.debugElement.queryAll(By.css('button.nav-link.disabled'));
      expect(disabledItems.length).toBe(inaccessiblePages.length);
    });
  });
});
