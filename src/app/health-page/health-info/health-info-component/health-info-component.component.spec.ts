import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import {
  HealthInfoComponentOne,
  HealthInfoComponentTwo,
} from '../../../shared/mocks/health-endpoint.mocks';
import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';
import { ObjNgFor } from '../../../shared/utils/object-ngfor.pipe';
import { HealthInfoComponentComponent } from './health-info-component.component';

describe('HealthInfoComponentComponent', () => {
  let component: HealthInfoComponentComponent;
  let fixture: ComponentFixture<HealthInfoComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NgbCollapseModule,
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        HealthInfoComponentComponent,
        ObjNgFor,
      ],
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
      const properties = fixture.debugElement.queryAll(By.css('[data-test="property"]'));
      expect(properties.length).toBe(14);
      const components = fixture.debugElement.queryAll(By.css('[data-test="info-component"]'));
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
