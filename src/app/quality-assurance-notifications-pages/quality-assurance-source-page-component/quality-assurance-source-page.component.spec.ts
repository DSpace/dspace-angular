import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { QualityAssuranceSourceComponent } from '../../notifications/qa/source/quality-assurance-source.component';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { QualityAssuranceSourcePageComponent } from './quality-assurance-source-page.component';

describe('QualityAssuranceSourcePageComponent', () => {
  let component: QualityAssuranceSourcePageComponent;
  let fixture: ComponentFixture<QualityAssuranceSourcePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualityAssuranceSourcePageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(QualityAssuranceSourcePageComponent, {
        remove: {
          imports: [QualityAssuranceSourceComponent],
        },
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
