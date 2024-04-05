import { CommonModule } from '@angular/common';
import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  BrowserModule,
  By,
} from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { AuthService } from '../core/auth/auth.service';
import { buildPaginatedList } from '../core/data/paginated-list.model';
import { PaginationService } from '../core/pagination/pagination.service';
import { PageInfo } from '../core/shared/page-info.model';
import { AlertComponent } from '../shared/alert/alert.component';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { MockActivatedRoute } from '../shared/mocks/active-router.mock';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { SubscriptionViewComponent } from '../shared/subscriptions/subscription-view/subscription-view.component';
import { SubscriptionsDataService } from '../shared/subscriptions/subscriptions-data.service';
import { PaginationServiceStub } from '../shared/testing/pagination-service.stub';
import {
  mockSubscriptionEperson,
  subscriptionMock,
  subscriptionMock2,
} from '../shared/testing/subscriptions-data.mock';
import { VarDirective } from '../shared/utils/var.directive';
import { SubscriptionsPageComponent } from './subscriptions-page.component';

describe('SubscriptionsPageComponent', () => {
  let component: SubscriptionsPageComponent;
  let fixture: ComponentFixture<SubscriptionsPageComponent>;
  let de: DebugElement;

  const authServiceStub = jasmine.createSpyObj('authorizationService', {
    getAuthenticatedUserFromStore: observableOf(mockSubscriptionEperson),
  });

  const subscriptionServiceStub = jasmine.createSpyObj('SubscriptionsDataService', {
    findByEPerson: jasmine.createSpy('findByEPerson'),
  });

  const paginationService = new PaginationServiceStub();

  const mockSubscriptionList = [subscriptionMock, subscriptionMock2];

  const emptyPageInfo = Object.assign(new PageInfo(), {
    totalElements: 0,
  });

  const pageInfo = Object.assign(new PageInfo(), {
    totalElements: 2,
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        NoopAnimationsModule,
        SubscriptionsPageComponent, SubscriptionViewComponent, VarDirective,
      ],
      providers: [
        { provide: SubscriptionsDataService, useValue: subscriptionServiceStub },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: AuthService, useValue: authServiceStub },
        { provide: PaginationService, useValue: paginationService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(SubscriptionsPageComponent, {
        remove: {
          imports: [ThemedLoadingComponent, PaginationComponent, AlertComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionsPageComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

  describe('when there are subscriptions', () => {

    beforeEach(() => {
      subscriptionServiceStub.findByEPerson.and.returnValue(createSuccessfulRemoteDataObject$(buildPaginatedList(pageInfo, mockSubscriptionList)));
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show table', () => {
      expect(de.query(By.css('[data-test="subscription-table"]'))).toBeTruthy();
      expect(de.query(By.css('[data-test="empty-alert"]'))).toBeNull();
    });

    it('should show a row for each results entry',() => {
      expect(de.query(By.css('[data-test="subscription-table"]'))).toBeTruthy();
      expect(de.query(By.css('[data-test="empty-alert"]'))).toBeNull();
      expect(de.queryAll(By.css('tbody > tr')).length).toEqual(2);
    });
  });

  describe('when there are no subscriptions', () => {

    beforeEach(() => {
      subscriptionServiceStub.findByEPerson.and.returnValue(createSuccessfulRemoteDataObject$(buildPaginatedList(emptyPageInfo, [])));
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should not show table', () => {
      expect(de.query(By.css('[data-test="subscription-table"]'))).toBeNull();
      expect(de.query(By.css('[data-test="empty-alert"]'))).toBeTruthy();
    });
  });

});
