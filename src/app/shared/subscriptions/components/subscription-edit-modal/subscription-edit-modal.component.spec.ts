import { ComponentFixture, ComponentFixtureAutoDetect, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';

// Import modules
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DebugElement } from '@angular/core';

import { SubscriptionEditModalComponent } from './subscription-edit-modal.component';

// Import mocks
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';
import { subscription } from '../../../testing/subscriptions-data.mock';
import { ItemInfo } from '../../../testing/relationships-mocks';

// Import utils
import { NotificationsService } from '../../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../../testing/notifications-service.stub';
import { SubscriptionService } from '../../subscription.service';
import { Subscription } from '../../models/subscription.model';


describe('SubscriptionEditModalComponent', () => {
  let component: SubscriptionEditModalComponent;
  let fixture: ComponentFixture<SubscriptionEditModalComponent>;
  let de: DebugElement;

  const subscriptionServiceStub = jasmine.createSpyObj('SubscriptionService', {
    updateSubscription: jasmine.createSpy('updateSubscription'),
  });


  beforeEach(waitForAsync (() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [ SubscriptionEditModalComponent ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: NotificationsService, useValue: NotificationsServiceStub },
        { provide: SubscriptionService, useValue: subscriptionServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionEditModalComponent);
    component = fixture.componentInstance;
    component.eperson = 'testid123';
    component.dso = ItemInfo.payload;

    de = fixture.debugElement;

    subscriptionServiceStub.updateSubscription.and.returnValue(cold('a|', {
      a: {}
    }));


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('No Subscription inserted', () => {
    it('should not show form', () => {
      expect(de.query(By.css('form'))).toBeNull();
    });
  });


  describe('Subscription inserted', () => {

    beforeEach(fakeAsync(() => {
      component.subscription = Object.assign(new Subscription(), subscription);
      component.ngOnInit();
      fixture.detectChanges();
    }));

    it('when insert subscription show form', () => {
      expect(de.query(By.css('form'))).toBeTruthy();
    });

    it('should have right checkboxes checked', () => {
      expect(de.query(By.css('#checkbox-0'))?.nativeElement?.checked).toEqual(true);
      expect(de.query(By.css('#checkbox-1'))?.nativeElement?.checked).toEqual(true);
      expect(de.query(By.css('#checkbox-2'))?.nativeElement?.checked).toEqual(false);
    });

    it('on checkbox clicked should change form values', () => {
      const checkbox = de.query(By.css('#checkbox-2')).nativeElement;
      checkbox.click();

      expect(de.query(By.css('#checkbox-2'))?.nativeElement?.checked).toEqual(true);
      expect(component.subscriptionParameterList?.value?.length).toEqual(3);
    });

    it('on submit clicked update should have been called', () => {
      const button = de.query(By.css('.btn-success')).nativeElement;
      button.click();
      expect(subscriptionServiceStub.updateSubscription).toHaveBeenCalled();
    });
  });
});
