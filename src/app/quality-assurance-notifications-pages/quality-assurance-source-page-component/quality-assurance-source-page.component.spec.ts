import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityAssuranceSourcePageComponent } from './quality-assurance-source-page.component';

describe('QualityAssuranceSourcePageComponent', () => {
  let component: QualityAssuranceSourcePageComponent;
  let fixture: ComponentFixture<QualityAssuranceSourcePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualityAssuranceSourcePageComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityAssuranceSourcePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create QualityAssuranceSourcePageComponent', () => {
    expect(component).toBeTruthy();
  });
});
