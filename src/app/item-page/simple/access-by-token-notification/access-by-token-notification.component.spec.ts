import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SplitPipe } from 'src/app/shared/utils/split.pipe';

import { APP_DATA_SERVICES_MAP } from '../../../../config/app-config.interface';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RequestService } from '../../../core/data/request.service';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { ItemRequest } from '../../../core/shared/item-request.model';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ActivatedRouteStub } from '../../../shared/testing/active-router.stub';
import { HALEndpointServiceStub } from '../../../shared/testing/hal-endpoint-service.stub';
import { VarDirective } from '../../../shared/utils/var.directive';
import { AccessByTokenNotificationComponent } from './access-by-token-notification.component';

describe('AccessByTokenNotificationComponent', () => {
  let component: AccessByTokenNotificationComponent;
  let fixture: ComponentFixture<AccessByTokenNotificationComponent>;
  let activatedRouteStub: ActivatedRouteStub;
  let itemRequestSubject: BehaviorSubject<ItemRequest>;

  const createItemRequest = (acceptRequest: boolean, accessExpired: boolean, accessExpiry?: string): ItemRequest => {
    const itemRequest = new ItemRequest();
    itemRequest.acceptRequest = acceptRequest;
    itemRequest.accessExpired = accessExpired;
    itemRequest.accessExpiry = accessExpiry;
    return itemRequest;
  };

  beforeEach(async () => {
    itemRequestSubject = new BehaviorSubject<ItemRequest>(null);
    activatedRouteStub = new ActivatedRouteStub({}, { itemRequest: null });
    (activatedRouteStub as any).data = itemRequestSubject.asObservable().pipe(
      map(itemRequest => ({ itemRequest })),
    );

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot(),
        AccessByTokenNotificationComponent,
        SplitPipe,
        VarDirective,
      ],
      providers: [
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: RequestService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: HALEndpointService, useValue: new HALEndpointServiceStub('test') },
        ObjectCacheService,
        RemoteDataBuildService,
        provideMockStore({}),
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AccessByTokenNotificationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not display any alert when no itemRequest is present', () => {
    itemRequestSubject.next(null);
    fixture.detectChanges();

    const alertElements = fixture.debugElement.queryAll(By.css('.alert'));
    expect(alertElements.length).toBe(0);
  });

  it('should display an error alert when request has not been accepted', () => {
    // Set up a request that has not been accepted
    const itemRequest = createItemRequest(false, false);
    itemRequestSubject.next(itemRequest);
    fixture.detectChanges();

    // Check for the error alert with the correct class
    const alertElement = fixture.debugElement.query(By.css('.alert.alert-danger.request-a-copy-access-success'));
    expect(alertElement).toBeTruthy();

    // Verify the content includes the lock icon
    const lockIcon = alertElement.query(By.css('.fa-lock'));
    expect(lockIcon).toBeTruthy();

    // Verify the text content mentions re-requesting
    const paragraphs = alertElement.queryAll(By.css('p'));
    expect(paragraphs.length).toBe(2);
  });

  it('should display an expired access alert when access period has expired', () => {
    // Set up a request that has been accepted but expired
    const itemRequest = createItemRequest(true, true, '2023-01-01');
    itemRequestSubject.next(itemRequest);
    fixture.detectChanges();

    // Check for the expired alert with the correct class
    const alertElement = fixture.debugElement.query(By.css('.alert.alert-danger.request-a-copy-access-expired'));
    expect(alertElement).toBeTruthy();
  });
});
