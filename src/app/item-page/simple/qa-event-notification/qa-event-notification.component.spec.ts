import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QaEventNotificationComponent } from './qa-event-notification.component';
import { createSuccessfulRemoteDataObject$ } from 'src/app/shared/remote-data.utils';
import { createPaginatedList } from 'src/app/shared/testing/utils.test';
import { QualityAssuranceSourceObject } from 'src/app/core/notifications/qa/models/quality-assurance-source.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { QualityAssuranceSourceDataService } from 'src/app/core/notifications/qa/source/quality-assurance-source-data.service';
import { RequestService } from 'src/app/core/data/request.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { ObjectCacheService } from 'src/app/core/cache/object-cache.service';
import { RemoteDataBuildService } from 'src/app/core/cache/builders/remote-data-build.service';
import { provideMockStore } from '@ngrx/store/testing';
import { HALEndpointService } from 'src/app/core/shared/hal-endpoint.service';
import { HALEndpointServiceStub } from 'src/app/shared/testing/hal-endpoint-service.stub';

describe('QaEventNotificationComponent', () => {
  let component: QaEventNotificationComponent;
  let fixture: ComponentFixture<QaEventNotificationComponent>;
  let qualityAssuranceSourceDataServiceStub: any;

  const obj = createSuccessfulRemoteDataObject$(createPaginatedList([new QualityAssuranceSourceObject()]));
  const item = Object.assign({ uuid: '1234' });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule.forRoot()],
      declarations: [ QaEventNotificationComponent ],
      providers: [
             { provide: QualityAssuranceSourceDataService, useValue: qualityAssuranceSourceDataServiceStub },
             { provide: RequestService, useValue: {} },
             { provide: NotificationsService, useValue: {} },
             { provide: HALEndpointService, useValue: new HALEndpointServiceStub('test')},
             ObjectCacheService,
             RemoteDataBuildService,
             provideMockStore({})
           ],
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
