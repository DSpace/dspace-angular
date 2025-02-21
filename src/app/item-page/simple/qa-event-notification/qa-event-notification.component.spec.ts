import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { SplitPipe } from 'src/app/shared/utils/split.pipe';

import { RemoteDataBuildService } from '@dspace/core';
import { ObjectCacheService } from '@dspace/core';
import { APP_DATA_SERVICES_MAP } from '@dspace/core';
import { RequestService } from '@dspace/core';
import { NotificationsService } from '@dspace/core';
import { QualityAssuranceSourceObject } from '@dspace/core';
import { QualityAssuranceSourceDataService } from '@dspace/core';
import { HALEndpointService } from '@dspace/core';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core';
import { ActivatedRouteStub } from '@dspace/core';
import { HALEndpointServiceStub } from '@dspace/core';
import { createPaginatedList } from '@dspace/core';
import { QaEventNotificationComponent } from './qa-event-notification.component';

describe('QaEventNotificationComponent', () => {
  let component: QaEventNotificationComponent;
  let fixture: ComponentFixture<QaEventNotificationComponent>;
  let qualityAssuranceSourceDataServiceStub: any;

  const obj = Object.assign(new QualityAssuranceSourceObject(), {
    id: 'sourceName:target',
    source: 'sourceName',
    target: 'target',
    totalEvents: 1,
  });

  const objPL = createSuccessfulRemoteDataObject$(createPaginatedList([obj]));
  const item = Object.assign({ uuid: '1234' });
  beforeEach(async () => {

    qualityAssuranceSourceDataServiceStub = {
      getSourcesByTarget: () => objPL,
    };
    await TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule.forRoot(), QaEventNotificationComponent, SplitPipe],
      providers: [
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: QualityAssuranceSourceDataService, useValue: qualityAssuranceSourceDataServiceStub },
        { provide: RequestService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: HALEndpointService, useValue: new HALEndpointServiceStub('test') },
        ObjectCacheService,
        RemoteDataBuildService,
        provideMockStore({}),
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
