// Import modules
import { CommonModule } from '@angular/common';
import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  BrowserModule,
  By,
} from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { Item } from '../../../core/shared/item.model';
import { ITEM } from '../../../core/shared/item.resource-type';
import { getMockThemeService } from '../../mocks/theme-service.mock';
// Import mocks
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
// Import utils
import { NotificationsService } from '../../notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import {
  findByEPersonAndDsoResEmpty,
  subscriptionMock,
} from '../../testing/subscriptions-data.mock';
import { ThemeService } from '../../theme-support/theme.service';
import { Subscription } from '../models/subscription.model';
import { SubscriptionsDataService } from '../subscriptions-data.service';
import { SubscriptionViewComponent } from './subscription-view.component';

describe('SubscriptionViewComponent', () => {
  let component: SubscriptionViewComponent;
  let fixture: ComponentFixture<SubscriptionViewComponent>;
  let de: DebugElement;
  let modalService;

  const subscriptionServiceStub = jasmine.createSpyObj('SubscriptionsDataService', {
    getSubscriptionByPersonDSO: observableOf(findByEPersonAndDsoResEmpty),
    deleteSubscription: createSuccessfulRemoteDataObject$({}),
    updateSubscription: createSuccessfulRemoteDataObject$({}),
  });

  const mockItem = Object.assign(new Item(), {
    id: 'fake-id',
    uuid: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018',
    type: ITEM,
    _links: {
      self: {
        href: 'https://localhost:8000/items/fake-id',
      },
    },
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NgbModule,
        ReactiveFormsModule,
        BrowserModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        SubscriptionViewComponent,
      ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: NotificationsService, useValue: NotificationsServiceStub },
        { provide: SubscriptionsDataService, useValue: subscriptionServiceStub },
        { provide: ThemeService, useValue: getMockThemeService() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionViewComponent);
    component = fixture.componentInstance;
    component.eperson = 'testid123';
    component.dso = mockItem;
    component.subscription = Object.assign(new Subscription(), subscriptionMock);
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have dso object info', () => {
    expect(de.query(By.css('.dso-info > ds-type-badge'))).toBeTruthy();
    expect(de.query(By.css('.dso-info > p > a'))).toBeTruthy();
  });

  it('should have subscription type info', () => {
    expect(de.query(By.css('.subscription-type'))).toBeTruthy();
  });

  it('should have subscription paramenter info', () => {
    expect(de.query(By.css('.subscription-parameters > span'))).toBeTruthy();
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
