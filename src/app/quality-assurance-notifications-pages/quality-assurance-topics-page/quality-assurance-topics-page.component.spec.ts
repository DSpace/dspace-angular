import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { QualityAssuranceTopicsComponent } from '../../notifications/qa/topics/quality-assurance-topics.component';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { QualityAssuranceTopicsPageComponent } from './quality-assurance-topics-page.component';

describe('QualityAssuranceTopicsPageComponent', () => {
  let component: QualityAssuranceTopicsPageComponent;
  let fixture: ComponentFixture<QualityAssuranceTopicsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [QualityAssuranceTopicsPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(QualityAssuranceTopicsPageComponent, {
        remove: {
          imports: [QualityAssuranceTopicsComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityAssuranceTopicsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create QualityAssuranceTopicsPageComponent', () => {
    expect(component).toBeTruthy();
  });
});
