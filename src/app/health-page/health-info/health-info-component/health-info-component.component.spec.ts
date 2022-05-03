import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { HealthInfoComponentComponent } from './health-info-component.component';
import { HealthInfoComponentOne, HealthInfoComponentTwo } from '../../../shared/mocks/health-endpoint.mocks';
import { ObjNgFor } from '../../../shared/utils/object-ngfor.pipe';

describe('HealthInfoComponentComponent', () => {
  let component: HealthInfoComponentComponent;
  let fixture: ComponentFixture<HealthInfoComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NgbCollapseModule,
        NoopAnimationsModule
      ],
      declarations: [
        HealthInfoComponentComponent,
        ObjNgFor
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthInfoComponentComponent);
    component = fixture.componentInstance;
  });

  describe('when has nested components', () => {
    beforeEach(() => {
      component.healthInfoComponentName = 'App';
      component.healthInfoComponent = HealthInfoComponentOne;
      component.isCollapsed = false;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display property', () => {
      const components = fixture.debugElement.queryAll(By.css('[data-test="component"]'));
      expect(components.length).toBe(4);
    });

  });

  describe('when has plain properties', () => {
    beforeEach(() => {
      component.healthInfoComponentName = 'Java';
      component.healthInfoComponent = HealthInfoComponentTwo;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display property', () => {
      const property = fixture.debugElement.queryAll(By.css('[data-test="property"]'));
      expect(property.length).toBe(1);
    });

  });
});
