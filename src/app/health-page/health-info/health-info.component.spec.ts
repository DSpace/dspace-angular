import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthInfoComponent } from './health-info.component';
import { HealthInfoResponseObj } from '../../shared/mocks/health-endpoint.mocks';
import { ObjNgFor } from '../../shared/utils/object-ngfor.pipe';
import { By } from '@angular/platform-browser';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HealthInfoComponent', () => {
  let component: HealthInfoComponent;
  let fixture: ComponentFixture<HealthInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgbAccordionModule,
      ],
      declarations: [
        HealthInfoComponent,
        ObjNgFor
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthInfoComponent);
    component = fixture.componentInstance;
    component.healthInfoResponse = HealthInfoResponseObj;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create info component properly', () => {
    const components = fixture.debugElement.queryAll(By.css('[data-test="info-component"]'));
    expect(components.length).toBe(3);
  });
});
