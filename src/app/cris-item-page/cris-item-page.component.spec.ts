import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { AuthService } from '../core/auth/auth.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { ItemDataService } from '../core/data/item-data.service';
import { Item } from '../core/shared/item.model';
import { CrisLayoutComponent } from '../cris-layout/cris-layout.component';
import { ThemedItemAlertsComponent } from '../item-page/alerts/themed-item-alerts.component';
import { createRelationshipsObservable } from '../item-page/simple/item-types/shared/item.component.spec';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import {
  createNoContentRemoteDataObject,
  createPendingRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../shared/remote-data.utils';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { createPaginatedList } from '../shared/testing/utils.test';
import { VarDirective } from '../shared/utils/var.directive';
import { CrisItemPageComponent } from './cris-item-page.component';

const mockItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
  metadata: [],
  relationships: createRelationshipsObservable(),
});

const authService = jasmine.createSpyObj('authService', {
  isAuthenticated: of(true),
  setRedirectUrl: {},
});

const authorizationService = jasmine.createSpyObj('AuthorizationDataService', {
  isAuthorized: of(true),
});

describe('CrisItemPageComponent', () => {
  let component: CrisItemPageComponent;
  let fixture: ComponentFixture<CrisItemPageComponent>;

  const mockRoute = Object.assign(new ActivatedRouteStub(), {
    data: of({ dso: createSuccessfulRemoteDataObject(mockItem) }),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), BrowserAnimationsModule, CrisItemPageComponent, VarDirective],
      providers: [
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: ItemDataService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: AuthService, useValue: authService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(CrisItemPageComponent, { remove: { imports: [ThemedLoadingComponent, ThemedItemAlertsComponent, CrisLayoutComponent] } }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisItemPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when the item is loading', () => {
    beforeEach(() => {
      component.itemRD$ = createPendingRemoteDataObject$(undefined);
      fixture.detectChanges();
    });

    it('should display a loading component', () => {
      const loading = fixture.debugElement.query(By.css('ds-loading'));
      expect(loading.nativeElement).toBeDefined();
    });
  });

  describe('when the item is loaded', () => {
    beforeEach(() => {
      component.itemRD$ = createSuccessfulRemoteDataObject$(mockItem);
      fixture.detectChanges();
    });

    it('should display the cris layout component', () => {
      const layout = fixture.debugElement.query(By.css('ds-cris-layout'));
      expect(layout.nativeElement).toBeDefined();
    });
  });

  describe('when the item is no content', () => {
    beforeEach(() => {
      const itemRD = createNoContentRemoteDataObject<Item>();
      itemRD.statusCode = 204;
      component.itemRD$ = of(itemRD);
      fixture.detectChanges();
    });

    it('should not display the cris layout component', () => {
      const layout = fixture.debugElement.query(By.css('ds-cris-layout'));
      expect(layout).toBeNull();
    });
  });
});
