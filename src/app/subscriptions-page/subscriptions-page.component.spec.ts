import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';


// Import modules
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';


// Import components
import { SubscriptionsPageComponent } from './subscriptions-page.component';

// Import services
import { PaginationService } from '../core/pagination/pagination.service';
import { SubscriptionService } from '../shared/subscriptions/subscription.service';
import { PaginationServiceStub } from '../shared/testing/pagination-service.stub';
import { RouterStub } from '../shared/testing/router.stub';
import { AuthService } from '../core/auth/auth.service';

// Import utils
import { HostWindowService } from '../shared/host-window.service';
import { HostWindowServiceStub } from '../shared/testing/host-window-service.stub';


// Import mocks
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { findAllSubscriptionRes } from '../shared/testing/subscriptions-data.mock';
import { MockActivatedRoute } from '../shared/mocks/active-router.mock';
import { of as observableOf } from 'rxjs';
import { SubscriptionsModule } from '../shared/subscriptions/subscriptions.module';
import { EPersonMock } from '../shared/testing/eperson.mock';


describe('SubscriptionsPageComponent', () => {
  let component: SubscriptionsPageComponent;
  let fixture: ComponentFixture<SubscriptionsPageComponent>;
  let de: DebugElement;

  const authServiceStub = jasmine.createSpyObj('authorizationService', {
    getAuthenticatedUserFromStore: observableOf(EPersonMock)
  });

  const subscriptionServiceStub = jasmine.createSpyObj('SubscriptionService', {
    findByEPerson: observableOf(findAllSubscriptionRes)
  });
  const paginationService = new PaginationServiceStub();

  beforeEach(waitForAsync( () => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        SharedModule,
        SubscriptionsModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [ SubscriptionsPageComponent ],
      providers:[
        { provide: SubscriptionService, useValue: subscriptionServiceStub },
        { provide: Router, useValue: new RouterStub() },
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

    it('should show table', async() => {
      await fixture.whenStable();
      fixture.detectChanges();
      const table = de.query(By.css('table'));
      expect(table).toBeTruthy();
    });

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
