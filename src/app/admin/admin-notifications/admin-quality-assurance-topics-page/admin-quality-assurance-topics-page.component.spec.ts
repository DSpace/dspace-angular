import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminQualityAssuranceTopicsPageComponent } from './admin-quality-assurance-topics-page.component';
import { QualityAssuranceTopicsComponent } from '../../../notifications/qa/topics/quality-assurance-topics.component';

describe('AdminQualityAssuranceTopicsPageComponent', () => {
  let component: AdminQualityAssuranceTopicsPageComponent;
  let fixture: ComponentFixture<AdminQualityAssuranceTopicsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [AdminQualityAssuranceTopicsPageComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
      .overrideComponent(AdminQualityAssuranceTopicsPageComponent, {
        remove: {
          imports: [
            QualityAssuranceTopicsComponent
          ]
        }
      })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminQualityAssuranceTopicsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AdminQualityAssuranceTopicsPageComponent', () => {
    expect(component).toBeTruthy();
  });
});
