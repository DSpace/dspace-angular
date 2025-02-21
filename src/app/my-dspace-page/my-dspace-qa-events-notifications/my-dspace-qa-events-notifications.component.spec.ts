import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { QualityAssuranceSourceObject } from '../../../../modules/core/src/lib/core/notifications/qa/models/quality-assurance-source.model';

import { QualityAssuranceSourceDataService } from '../../../../modules/core/src/lib/core/notifications/qa/source/quality-assurance-source-data.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { createPaginatedList } from '../../../../modules/core/src/lib/core/utilities/testing/utils.test';
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
