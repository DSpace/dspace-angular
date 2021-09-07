import { ComponentFixture, fakeAsync, inject, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';

// Import modules
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement,ChangeDetectionStrategy } from '@angular/core';

import { SubscriptionViewComponent } from './subscription-view.component';

// Import mocks
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';
import { MockActivatedRoute } from '../../../mocks/active-router.mock';
import { ItemInfo } from '../../../testing/relationships-mocks';
import { findByEPersonAndDsoRes, findByEPersonAndDsoResEmpty, subscription } from '../../../testing/subscriptions-data.mock';

// Import utils
import { NotificationsService } from '../../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../../testing/notifications-service.stub';
import { SubscriptionService } from '../../subscription.service';
import { Subscription } from '../../models/subscription.model';

import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';

import {
  createNoContentRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$
} from '../../../remote-data.utils';



describe('SubscriptionViewComponent', () => {
  let component: SubscriptionViewComponent;
  let fixture: ComponentFixture<SubscriptionViewComponent>;
  let de: DebugElement;
  let modalService;

  const subscriptionServiceStub = jasmine.createSpyObj('SubscriptionService', {
    getSubscriptionByPersonDSO: observableOf(findByEPersonAndDsoResEmpty),
    deleteSubscription: createSuccessfulRemoteDataObject$({}),
    updateSubscription: createSuccessfulRemoteDataObject$({}),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NgbModule,
        ReactiveFormsModule,
        BrowserModule,
        RouterTestingModule,
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [ SubscriptionViewComponent ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: NotificationsService, useValue: NotificationsServiceStub },
        { provide: SubscriptionService, useValue: subscriptionServiceStub },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionViewComponent);
    component = fixture.componentInstance;
    component.eperson = 'testid123';
    component.dso = ItemInfo.payload;
    component.subscription = Object.assign(new Subscription(), subscription);
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should open modal when clicked edit button', () => {
    modalService = (component as any).modalService;
    const modalSpy = spyOn(modalService, 'open');

    const editBtn = de.query(By.css('.btn-outline-primary')).nativeElement;
    editBtn.click();

    expect(modalService.open).toHaveBeenCalled();
  });

  it('should call delete function when clicked delete button', () => {
    const deleteSpy = spyOn(component, 'deleteSubscriptionPopup');

    const deleteBtn = de.query(By.css('.btn-outline-danger')).nativeElement;
    deleteBtn.click();

    expect(deleteSpy).toHaveBeenCalled();
  });

});
