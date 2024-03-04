import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDspaceQaEventsNotificationsComponent } from './my-dspace-qa-events-notifications.component';
import { QualityAssuranceSourceDataService } from '../../core/notifications/qa/source/quality-assurance-source-data.service';
import { createSuccessfulRemoteDataObject$ } from 'src/app/shared/remote-data.utils';
import { createPaginatedList } from 'src/app/shared/testing/utils.test';
import { QualityAssuranceSourceObject } from 'src/app/core/notifications/qa/models/quality-assurance-source.model';

describe('MyDspaceQaEventsNotificationsComponent', () => {
  let component: MyDspaceQaEventsNotificationsComponent;
  let fixture: ComponentFixture<MyDspaceQaEventsNotificationsComponent>;

  let qualityAssuranceSourceDataServiceStub: any;
  const obj = createSuccessfulRemoteDataObject$(createPaginatedList([new QualityAssuranceSourceObject()]));

  beforeEach(async () => {
    qualityAssuranceSourceDataServiceStub = {
      getSources: () => obj
    };
    await TestBed.configureTestingModule({
      declarations: [ MyDspaceQaEventsNotificationsComponent ],
      providers: [
        { provide: QualityAssuranceSourceDataService, useValue: qualityAssuranceSourceDataServiceStub }
      ]
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
