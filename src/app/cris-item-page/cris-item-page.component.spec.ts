import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrisItemPageComponent } from './cris-item-page.component';
import { Item } from '../core/shared/item.model';
import {
  createNoContentRemoteDataObject,
  createPendingRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$
} from '../shared/remote-data.utils';
import { createRelationshipsObservable } from '../item-page/simple/item-types/shared/item.component.spec';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemDataService } from '../core/data/item-data.service';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VarDirective } from '../shared/utils/var.directive';
import { AuthService } from '../core/auth/auth.service';
import { createPaginatedList } from '../shared/testing/utils.test';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';

const mockItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
  metadata: [],
  relationships: createRelationshipsObservable()
});

const authService = jasmine.createSpyObj('authService', {
  isAuthenticated: of(true),
  setRedirectUrl: {}
});

const authorizationService = jasmine.createSpyObj('AuthorizationDataService', {
  isAuthorized: of(true)
});

describe('CrisItemPageComponent', () => {
  let component: CrisItemPageComponent;
  let fixture: ComponentFixture<CrisItemPageComponent>;

  const mockRoute = Object.assign(new ActivatedRouteStub(), {
    data: of({ dso: createSuccessfulRemoteDataObject(mockItem) })
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule],
      declarations: [ CrisItemPageComponent, VarDirective ],
      providers: [
        {provide: AuthorizationDataService, useValue: authorizationService},
        {provide: ActivatedRoute, useValue: mockRoute},
        {provide: ItemDataService, useValue: {}},
        {provide: Router, useValue: {}},
        { provide: AuthService, useValue: authService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
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
      const loading = fixture.debugElement.query(By.css('ds-themed-loading'));
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
