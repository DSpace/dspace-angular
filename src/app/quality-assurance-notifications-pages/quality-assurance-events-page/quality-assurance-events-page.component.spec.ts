import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';

import { QualityAssuranceEventsComponent } from '../../notifications/qa/events/quality-assurance-events.component';
import { QualityAssuranceEventsPageComponent } from './quality-assurance-events-page.component';

describe('QualityAssuranceEventsPageComponent', () => {
  let component: QualityAssuranceEventsPageComponent;
  let fixture: ComponentFixture<QualityAssuranceEventsPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [QualityAssuranceEventsPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(QualityAssuranceEventsPageComponent, {
        remove: {
          imports: [QualityAssuranceEventsComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityAssuranceEventsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AdminQualityAssuranceEventsPageComponent', () => {
    expect(component).toBeTruthy();
  });
});
