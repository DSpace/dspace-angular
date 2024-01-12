import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QualityAssuranceEventsPageComponent } from './quality-assurance-events-page.component';

describe('QualityAssuranceEventsPageComponent', () => {
  let component: QualityAssuranceEventsPageComponent;
  let fixture: ComponentFixture<QualityAssuranceEventsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityAssuranceEventsPageComponent ],
      schemas: [NO_ERRORS_SCHEMA]
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
