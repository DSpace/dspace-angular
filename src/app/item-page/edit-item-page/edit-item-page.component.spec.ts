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
import { Item } from '@dspace/core/shared/item.model';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { createSuccessfulRemoteDataObject } from '@dspace/core/utilities/remote-data.utils';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

import { EditItemPageComponent } from './edit-item-page.component';

describe('EditItemPageComponent', () => {
  let comp: EditItemPageComponent;
  let fixture: ComponentFixture<EditItemPageComponent>;

  const AcceptAllGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> => {
    return of(true);
  };

  const AcceptNoneGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> => {
    return of(false);
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
    data: of({ dso: createSuccessfulRemoteDataObject(new Item()) }),
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
