import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';


// Import modules
import { CommonModule } from '@angular/common';
import { BrowserModule, By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

// Import components
import { SubscriptionsPageComponent } from './subscriptions-page.component';

// Import services
import { PaginationService } from '../core/pagination/pagination.service';
import { SubscriptionService } from '../shared/subscriptions/subscription.service';
import { PaginationServiceStub } from '../shared/testing/pagination-service.stub';
import { AuthService } from '../core/auth/auth.service';

// Import utils
import { HostWindowService } from '../shared/host-window.service';
import { HostWindowServiceStub } from '../shared/testing/host-window-service.stub';


// Import mocks
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { mockSubscriptionList } from '../shared/testing/subscriptions-data.mock';
import { MockActivatedRoute } from '../shared/mocks/active-router.mock';
import { of as observableOf } from 'rxjs';
import { EPersonMock } from '../shared/testing/eperson.mock';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { VarDirective } from '../shared/utils/var.directive';
import {
  SubscriptionViewComponent
} from '../shared/subscriptions/components/subscription-view/subscription-view.component';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { PageInfo } from '../core/shared/page-info.model';
import { buildPaginatedList } from '../core/data/paginated-list.model';

describe('SubscriptionsPageComponent', () => {
  let component: SubscriptionsPageComponent;
  let fixture: ComponentFixture<SubscriptionsPageComponent>;
  let de: DebugElement;

  const authServiceStub = jasmine.createSpyObj('authorizationService', {
    getAuthenticatedUserFromStore: observableOf(EPersonMock)
  });

  const pageInfo = Object.assign(new PageInfo(), {
    'elementsPerPage': 10,
    'totalElements': 10,
    'totalPages': 1,
    'currentPage': 1
  });
  const subscriptionServiceStub = jasmine.createSpyObj('SubscriptionService', {
    findByEPerson: createSuccessfulRemoteDataObject$(buildPaginatedList(pageInfo, mockSubscriptionList))
  });
  const paginationService = new PaginationServiceStub();

  beforeEach(waitForAsync( () => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        NoopAnimationsModule
      ],
      declarations: [ PaginationComponent, SubscriptionsPageComponent, SubscriptionViewComponent, VarDirective ],
      providers:[
        { provide: SubscriptionService, useValue: subscriptionServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: AuthService, useValue: authServiceStub },
        { provide: PaginationService, useValue: paginationService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionsPageComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('when table', () => {

    it('should show table', fakeAsync(() => {
      flush();
      const table = de.query(By.css('table'));
      expect(table).toBeTruthy();
    }));

  });

  it('should show all the results', () => {
    expect(de.queryAll(By.css('tbody > tr')).length).toEqual(10);
  });

  it('should have dso object info', () => {
    expect(de.query(By.css('.dso-info > span'))).toBeTruthy();
    expect(de.query(By.css('.dso-info > p > a'))).toBeTruthy();
  });

  it('should have subscription type info', () => {
    expect(de.query(By.css('.subscription-type'))).toBeTruthy();
  });

  it('should have subscription paramenter info', () => {
    expect(de.query(By.css('.subscription-parmenters > span'))).toBeTruthy();
  });

  it('should have subscription action info', () => {
    expect(de.query(By.css('.btn-outline-primary'))).toBeTruthy();
    expect(de.query(By.css('.btn-outline-danger'))).toBeTruthy();
  });

});
