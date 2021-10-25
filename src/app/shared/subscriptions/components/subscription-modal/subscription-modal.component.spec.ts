import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

import { of as observableOf } from 'rxjs';

// Import modules
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DebugElement } from '@angular/core';

import { SubscriptionModalComponent } from './subscription-modal.component';

// Import mocks
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';
import { findByEPersonAndDsoRes, findByEPersonAndDsoResEmpty } from '../../../testing/subscriptions-data.mock';
import { ItemInfo } from '../../../testing/relationships-mocks';

// Import utils
import { NotificationsService } from '../../../notifications/notifications.service';
import { SubscriptionService } from '../../subscription.service';

import { createSuccessfulRemoteDataObject$ } from '../../../remote-data.utils';


describe('SubscriptionModalComponent', () => {
  let component: SubscriptionModalComponent;
  let fixture: ComponentFixture<SubscriptionModalComponent>;
  let de: DebugElement;

  let subscriptionServiceStub;
  const notificationServiceStub = {
    notificationWithAnchor() {
      return true;
    }
  };


  describe('when empty subscriptions', () => {

    beforeEach(async () => {

      subscriptionServiceStub = jasmine.createSpyObj('SubscriptionService', {
        getSubscriptionByPersonDSO: observableOf(findByEPersonAndDsoResEmpty),
        createSubscription: createSuccessfulRemoteDataObject$({}),
        updateSubscription: createSuccessfulRemoteDataObject$({}),
      });

      await TestBed.configureTestingModule({
        imports: [
          CommonModule,
          NgbModule,
          ReactiveFormsModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock
            }
          }),
        ],
        declarations: [SubscriptionModalComponent],
        providers: [
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: NotificationsService, useValue: notificationServiceStub },
          { provide: SubscriptionService, useValue: subscriptionServiceStub },
        ]
      })
        .compileComponents();

      fixture = TestBed.createComponent(SubscriptionModalComponent);
      component = fixture.componentInstance;
      component.epersonId = 'testid123';
      component.dso = ItemInfo.payload;
      de = fixture.debugElement;

      await fixture.whenStable();
      await fixture.whenRenderingDone();

      fixture.detectChanges();

    });

    it('should be no table', () => {
      expect(de.query(By.css('table'))).toBeNull();
    });

    it('should show empty form', () => {
      expect(de.query(By.css('form'))).toBeTruthy();
    });

    it('should show form with empty checkboxes', () => {
      expect(de.query(By.css('#checkbox-0'))?.nativeElement?.checked).toEqual(false);
      expect(de.query(By.css('#checkbox-1'))?.nativeElement?.checked).toEqual(false);
      expect(de.query(By.css('#checkbox-2'))?.nativeElement?.checked).toEqual(false);
    });

  });


  describe('when we have subscriptions', () => {

    beforeEach(async () => {

      subscriptionServiceStub = jasmine.createSpyObj('SubscriptionService', {
        getSubscriptionByPersonDSO: observableOf(findByEPersonAndDsoRes),
        createSubscription: createSuccessfulRemoteDataObject$({}),
        updateSubscription: createSuccessfulRemoteDataObject$({}),
      });

      await TestBed.configureTestingModule({
        imports: [
          CommonModule,
          NgbModule,
          ReactiveFormsModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock
            }
          }),
        ],
        declarations: [SubscriptionModalComponent],
        providers: [
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: NotificationsService, useValue: notificationServiceStub },
          { provide: SubscriptionService, useValue: subscriptionServiceStub },
        ]
      })
        .compileComponents();

      fixture = TestBed.createComponent(SubscriptionModalComponent);
      component = fixture.componentInstance;
      component.epersonId = 'testid123';
      component.dso = ItemInfo.payload;
      de = fixture.debugElement;
      await fixture.whenStable();
      await fixture.whenRenderingDone();

      fixture.detectChanges();

    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render 2 subscriptions', () => {
      expect(de.queryAll(By.css('tbody > tr')).length).toEqual(2);
    });

    it('should show no form', () => {
      expect(de.query(By.css('form'))).toBeNull();
    });

    it('should have 2 edit buttons', () => {
      expect(de.queryAll(By.css('.btn-outline-primary')).length).toEqual(2);
    });

    it('should have 2 delete buttons', () => {
      expect(de.queryAll(By.css('.btn-outline-danger')).length).toEqual(2);
    });

    describe('When creating new subscription', () => {

      beforeEach(() => {
        // add button click
        const button = de.query(By.css('.btn-success')).nativeElement;
        button.click();
      });


      it('should show form when add button click event', () => {
        expect(de.query(By.css('form'))).toBeTruthy();
      });

      it('should show form with empty checkboxes', () => {
        expect(de.query(By.css('#checkbox-0'))?.nativeElement?.checked).toEqual(false);
        expect(de.query(By.css('#checkbox-1'))?.nativeElement?.checked).toEqual(false);
        expect(de.query(By.css('#checkbox-2'))?.nativeElement?.checked).toEqual(false);
      });

      it('should call create request when submit click event', () => {
        const checkbox = de.query(By.css('#checkbox-2')).nativeElement;
        checkbox.click();

        const button = de.queryAll(By.css('.btn-success'))[1].nativeElement;
        button.click();
        expect(subscriptionServiceStub.createSubscription).toHaveBeenCalled();
      });

    });


    describe('When updating subscription', () => {

      beforeEach(() => {
        // edit button click
        const button = de.query(By.css('.btn-outline-primary')).nativeElement;
        button.click();
      });

      it('should show form when edit button click event', () => {
        expect(de.query(By.css('form'))).toBeTruthy();
      });

      it('should show form with empty checkboxes', () => {
        expect(de.query(By.css('#checkbox-0'))?.nativeElement?.checked).toEqual(false);
        expect(de.query(By.css('#checkbox-1'))?.nativeElement?.checked).toEqual(true);
        expect(de.query(By.css('#checkbox-2'))?.nativeElement?.checked).toEqual(false);
      });

      it('should call update request when submit click event', () => {
        const button = de.queryAll(By.css('.btn-success'))[1].nativeElement;
        button.click();
        expect(subscriptionServiceStub.updateSubscription).toHaveBeenCalled();
      });

    });

  });

});
