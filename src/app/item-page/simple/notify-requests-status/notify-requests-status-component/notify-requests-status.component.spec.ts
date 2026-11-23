import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { AuthService } from '@dspace/core/auth/auth.service';
import { NotifyRequestsStatus } from '@dspace/core/coar-notify/notify-info/models/notify-requests-status.model';
import { RequestStatusEnum } from '@dspace/core/coar-notify/notify-info/models/notify-status.enum';
import { NotifyRequestsStatusDataService } from '@dspace/core/coar-notify/notify-info/notify-services-status-data.service';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { RequestStatusAlertBoxComponent } from '../request-status-alert-box/request-status-alert-box.component';
import { NotifyRequestsStatusComponent } from './notify-requests-status.component';

describe('NotifyRequestsStatusComponent', () => {
  let component: NotifyRequestsStatusComponent;
  let fixture: ComponentFixture<NotifyRequestsStatusComponent>;
  let notifyInfoServiceSpy;
  let authService: jasmine.SpyObj<AuthService>;

  const mock: NotifyRequestsStatus = Object.assign(new NotifyRequestsStatus(), {
    notifyStatus: [],
    itemuuid: 'testUuid',
  });

  beforeEach(waitForAsync(() => {
    notifyInfoServiceSpy = {
      getNotifyRequestsStatus:() => createSuccessfulRemoteDataObject$(mock),
    };
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: of(true),
    });
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NotifyRequestsStatusComponent],
      providers: [
        { provide: NotifyRequestsStatusDataService, useValue: notifyInfoServiceSpy },
        { provide: AuthService, useValue: authService },
      ],
    }).overrideComponent(NotifyRequestsStatusComponent, {
      remove: {
        imports: [RequestStatusAlertBoxComponent],
      },
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyRequestsStatusComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch data from the service on initialization', fakeAsync(() => {
    const mockData: NotifyRequestsStatus = Object.assign(new NotifyRequestsStatus(), {
      notifyStatus: [],
      itemuuid: 'testUuid',
    });
    component.itemUuid = mockData.itemuuid;
    spyOn(notifyInfoServiceSpy, 'getNotifyRequestsStatus').and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    tick();

    expect(notifyInfoServiceSpy.getNotifyRequestsStatus).toHaveBeenCalledWith('testUuid');
    component.requestMap$.subscribe((map) => {
      expect(map.size).toBe(0);
    });
  }));

  it('should not fetch data from the service when the user is not authenticated', fakeAsync(() => {
    authService.isAuthenticated.and.returnValue(of(false));
    component.itemUuid = 'testUuid';
    spyOn(notifyInfoServiceSpy, 'getNotifyRequestsStatus').and.callThrough();
    let result: Map<RequestStatusEnum, unknown[]>;

    fixture.detectChanges();
    component.requestMap$.subscribe((map) => result = map);
    tick();

    expect(notifyInfoServiceSpy.getNotifyRequestsStatus).not.toHaveBeenCalled();
    expect(result.size).toBe(0);
  }));

  it('should group data by status', () => {
    const mockData: NotifyRequestsStatus = Object.assign(new NotifyRequestsStatus(), {
      notifyStatus: [
        {
          serviceName: 'test1',
          serviceUrl: 'test',
          status: RequestStatusEnum.ACCEPTED,
        },
        {
          serviceName: 'test2',
          serviceUrl: 'test',
          status: RequestStatusEnum.REJECTED,
        },
        {
          serviceName: 'test3',
          serviceUrl: 'test',
          status: RequestStatusEnum.ACCEPTED,
        },
      ],
      itemUuid: 'testUuid',
    });
    spyOn(notifyInfoServiceSpy, 'getNotifyRequestsStatus').and.returnValue(createSuccessfulRemoteDataObject$(mockData));
    fixture.detectChanges();
    (component as any).groupDataByStatus(mockData);
    component.requestMap$.subscribe((map) => {
      expect(map.size).toBe(2);
      expect(map.get(RequestStatusEnum.ACCEPTED)?.length).toBe(2);
      expect(map.get(RequestStatusEnum.REJECTED)?.length).toBe(1);
    });
  });
});
