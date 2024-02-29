import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { NotifyRequestsStatusComponent } from './notify-requests-status.component';
import { NotifyRequestsStatusDataService } from 'src/app/core/data/notify-services-status-data.service';
import { NotifyRequestsStatus } from '../notify-requests-status.model';
import { RequestStatusEnum } from '../notify-status.enum';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';

describe('NotifyRequestsStatusComponent', () => {
  let component: NotifyRequestsStatusComponent;
  let fixture: ComponentFixture<NotifyRequestsStatusComponent>;
  let notifyInfoServiceSpy;

  const mock: NotifyRequestsStatus = Object.assign(new NotifyRequestsStatus(), {
    notifyStatus: [],
    itemuuid: 'testUuid'
  });

  beforeEach(() => {
    notifyInfoServiceSpy = {
      getNotifyRequestsStatus:() => createSuccessfulRemoteDataObject$(mock)
    };
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [NotifyRequestsStatusComponent],
      providers: [
        { provide: NotifyRequestsStatusDataService, useValue: notifyInfoServiceSpy }
      ]
    });
  });

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
      itemuuid: 'testUuid'
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
      itemUuid: 'testUuid'
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
