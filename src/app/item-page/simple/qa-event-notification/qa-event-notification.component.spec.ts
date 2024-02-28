import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QaEventNotificationComponent } from './qa-event-notification.component';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { QualityAssuranceSourceObject } from '../../../core/notifications/qa/models/quality-assurance-source.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { QualityAssuranceSourceDataService } from '../../../core/notifications/qa/source/quality-assurance-source-data.service';
import { RequestService } from '../../../core/data/request.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { provideMockStore } from '@ngrx/store/testing';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { HALEndpointServiceStub } from '../../../shared/testing/hal-endpoint-service.stub';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SplitPipe } from 'src/app/shared/utils/split.pipe';

describe('QaEventNotificationComponent', () => {
  let component: QaEventNotificationComponent;
  let fixture: ComponentFixture<QaEventNotificationComponent>;
  let qualityAssuranceSourceDataServiceStub: any;

  const obj = Object.assign(new QualityAssuranceSourceObject(), {
    id: 'sourceName:target',
    source: 'sourceName',
    target: 'target',
    totalEvents: 1
  });

  const objPL = createSuccessfulRemoteDataObject$(createPaginatedList([obj]));
  const item = Object.assign({ uuid: '1234' });
  beforeEach(async () => {

    qualityAssuranceSourceDataServiceStub = {
      getSourcesByTarget: () => objPL
    };
    await TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule.forRoot()],
      declarations: [QaEventNotificationComponent, SplitPipe],
      providers: [
        { provide: QualityAssuranceSourceDataService, useValue: qualityAssuranceSourceDataServiceStub },
        { provide: RequestService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: HALEndpointService, useValue: new HALEndpointServiceStub('test') },
        ObjectCacheService,
        RemoteDataBuildService,
        provideMockStore({})
      ],
    })
      .compileComponents();
    fixture = TestBed.createComponent(QaEventNotificationComponent);
    component = fixture.componentInstance;
    component.item = item;
    component.sources$ = of([obj]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display sources if present', () => {
    const alertElements = fixture.debugElement.queryAll(By.css('.alert'));
    expect(alertElements.length).toBe(1);
  });

  it('should return the quality assurance route when getQualityAssuranceRoute is called', () => {
    const route = component.getQualityAssuranceRoute();
    expect(route).toBe('/notifications/quality-assurance');
  });
});
