import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { QualityAssuranceSourceObject } from '@dspace/core';

import { QualityAssuranceSourceDataService } from '@dspace/core';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core';
import { createPaginatedList } from '@dspace/core';
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
