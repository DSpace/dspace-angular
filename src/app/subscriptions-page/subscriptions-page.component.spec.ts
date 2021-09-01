import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { DebugElement } from '@angular/core';

//Import modules
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

//Import components
import { SubscriptionsPageComponent } from './subscriptions-page.component';

//Import services
import { PaginationService } from '../core/pagination/pagination.service';
import { SubscriptionService } from '../shared/subscriptions/subscription.service';
import { PaginationServiceStub } from '../shared/testing/pagination-service.stub';
import { RouterStub } from '../shared/testing/router.stub';

//Import utils
import { buildPaginatedList, PaginatedList } from '../core/data/paginated-list.model';
import { PageInfo } from '../core/shared/page-info.model';
import { createSuccessfulRemoteDataObject } from '../shared/remote-data.utils';
import { createPaginatedList } from '../shared/testing/utils.test';



//Import mocks
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { findAllSubscriptionRes } from '../shared/testing/subscriptions-data.mock';

import { switchMap, map, take, tap } from 'rxjs/operators';
import { Observable, of as observableOf, BehaviorSubject, Subscription as rxSubscription } from 'rxjs';


describe('SubscriptionsPageComponent', () => {
  let component: SubscriptionsPageComponent;
  let fixture: ComponentFixture<SubscriptionsPageComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  let subscriptionServiceStub = jasmine.createSpyObj('SubscriptionService', {
    findAllSubscriptions: jasmine.createSpy('findAllSubscriptions')
  });
  let paginationService = new PaginationServiceStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NgbModule, 
        FormsModule, 
        ReactiveFormsModule, 
        BrowserModule,
        SharedModule,
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
        { provide: PaginationService, useValue: paginationService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionsPageComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    subscriptionServiceStub.findAllSubscriptions.and.returnValue(cold('a|', {
      a: findAllSubscriptionRes
    }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when table', () => {
      beforeEach(fakeAsync(() => {
        tick();
        fixture.detectChanges();
        let table = de.query(By.css('table'));
        console.log(table);
      }));

      it('should display search result', () => {
        expect(component).toBeTruthy();
      });
    });

  it('should show table', () => {
    expect(component).toBeTruthy();
  });
});
