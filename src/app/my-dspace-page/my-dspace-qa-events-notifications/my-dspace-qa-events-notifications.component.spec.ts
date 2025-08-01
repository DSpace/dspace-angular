import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { QualityAssuranceSourceObject } from '@core/notifications/qa/models/quality-assurance-source.model';
import { QualityAssuranceSourceDataService } from '@core/notifications/qa/source/quality-assurance-source-data.service';
import { createPaginatedList } from '@core/testing/utils.test';
import { createSuccessfulRemoteDataObject$ } from '@core/utilities/remote-data.utils';

import { MyDspaceQaEventsNotificationsComponent } from './my-dspace-qa-events-notifications.component';

describe('MyDspaceQaEventsNotificationsComponent', () => {
  let component: MyDspaceQaEventsNotificationsComponent;
  let fixture: ComponentFixture<MyDspaceQaEventsNotificationsComponent>;

  let qualityAssuranceSourceDataServiceStub: any;
  const obj = createSuccessfulRemoteDataObject$(createPaginatedList([new QualityAssuranceSourceObject()]));

  beforeEach(async () => {
    qualityAssuranceSourceDataServiceStub = {
      getSources: () => obj,
    };
    await TestBed.configureTestingModule({
      imports: [MyDspaceQaEventsNotificationsComponent],
      providers: [
        { provide: QualityAssuranceSourceDataService, useValue: qualityAssuranceSourceDataServiceStub },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MyDspaceQaEventsNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
