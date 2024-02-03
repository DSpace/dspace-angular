import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQualityAssuranceSourcePageComponent } from './admin-quality-assurance-source-page.component';

describe('AdminQualityAssuranceSourcePageComponent', () => {
  let component: AdminQualityAssuranceSourcePageComponent;
  let fixture: ComponentFixture<AdminQualityAssuranceSourcePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminQualityAssuranceSourcePageComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminQualityAssuranceSourcePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AdminQualityAssuranceSourcePageComponent', () => {
    expect(component).toBeTruthy();
  });
});
