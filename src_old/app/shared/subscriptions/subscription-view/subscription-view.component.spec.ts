import {
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SubscriptionsDataService } from '@dspace/core/data/subscriptions-data.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Item } from '@dspace/core/shared/item.model';
import { ITEM } from '@dspace/core/shared/item.resource-type';
import { Subscription } from '@dspace/core/shared/subscription.model';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import {
  findByEPersonAndDsoResEmpty,
  subscriptionMock,
} from '@dspace/core/testing/subscriptions-data.mock';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ThemedTypeBadgeComponent } from '../../object-collection/shared/badges/type-badge/themed-type-badge.component';
import { SubscriptionViewComponent } from './subscription-view.component';

describe('SubscriptionViewComponent', () => {
  let component: SubscriptionViewComponent;
  let fixture: ComponentFixture<SubscriptionViewComponent>;
  let de: DebugElement;

  let modalService: NgbModal = jasmine.createSpyObj('modalService', {
    open: {
      componentInstance: {
        updateSubscription: of(),
        response: of(),
      },
    },
  });
  const subscriptionServiceStub = jasmine.createSpyObj('SubscriptionsDataService', {
    getSubscriptionByPersonDSO: of(findByEPersonAndDsoResEmpty),
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
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        SubscriptionViewComponent,
      ],
      providers: [
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: SubscriptionsDataService, useValue: subscriptionServiceStub },
        { provide: NgbModal, useValue: modalService },
      ],
    }).overrideComponent(SubscriptionViewComponent, {
      add: {
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      },
      remove: {
        imports: [
          ThemedTypeBadgeComponent,
        ],
      },
    }).compileComponents();
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

  it('should have subscription parameter info', () => {
    expect(de.query(By.css('.subscription-parameters > span'))).toBeTruthy();
  });

  it('should have subscription action info', () => {
    expect(de.query(By.css('.btn-outline-primary'))).toBeTruthy();
    expect(de.query(By.css('.btn-outline-danger'))).toBeTruthy();
  });

  it('should open modal when clicked edit button', () => {
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
