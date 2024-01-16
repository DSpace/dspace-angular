import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QaEventNotificationComponent } from './qa-event-notification.component';
import { QualityAssuranceSourceDataService } from '../../../core/notifications/qa/source/quality-assurance-source-data.service';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { QualityAssuranceSourceObject } from '../../../core/notifications/qa/models/quality-assurance-source.model';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SplitPipe } from '../../../shared/utils/split.pipe';
import { RequestService } from '../../../core/data/request.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { HALEndpointServiceStub } from '../../../shared/testing/hal-endpoint-service.stub';

describe('QaEventNotificationComponent', () => {
  let component: QaEventNotificationComponent;
  let fixture: ComponentFixture<QaEventNotificationComponent>;

  let qualityAssuranceSourceDataServiceStub: any;

  const obj = createSuccessfulRemoteDataObject$(createPaginatedList([new QualityAssuranceSourceObject()]));
  const item = Object.assign({ uuid: '1234' });

  beforeEach(async () => {
    qualityAssuranceSourceDataServiceStub = {
      getSourcesByTarget: () => obj
    };
    await TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule.forRoot()],
      declarations: [QaEventNotificationComponent, SplitPipe],
      providers: [
        { provide: QualityAssuranceSourceDataService, useValue: qualityAssuranceSourceDataServiceStub },
        { provide: RequestService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: HALEndpointService, useValue: new HALEndpointServiceStub('test')},
        ObjectCacheService,
        RemoteDataBuildService,
        provideMockStore({})
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(QaEventNotificationComponent);
    component = fixture.componentInstance;
    component.item = item;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
